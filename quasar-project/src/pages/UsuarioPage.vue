<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h2 flex flex-center" style="font-weight: bold">Usuarios</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="max-width: 750px; width: 100%; margin: 0 auto; margin-top: 20px; padding: 20px">
      <div class="row q-col-gutter-sm items-center q-mb-lg">
        <div class="col-12 col-sm-auto">
          <q-btn class="full-width" color="primary" icon="add" label="Agregar Usuario" @click="AbrirRegistro()" />
        </div>

        <q-space class="gt-xs" />
        <div class="col-12 col-sm-5">
          <q-input v-model="search" placeholder="Buscar por nombre o rol..." outlined dense>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      
      <div class="col-12 col-md-12" style="margin-top: 20px">
        <q-card-section>

          <div v-if="loading" class="flex flex-center q-pa-lg">
            <q-spinner-dots color="primary" size="40px" />
          </div>

          <q-list bordered separator v-else>
            <q-item
              v-for="user in usuariosFiltrados"
              :key="user.UserID"
              clickable
              v-ripple
              @click="abrirDetalle(user)"
            >
              <q-item-section avatar>
                <q-icon color="primary" name="account_circle" size="30px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.Usuario }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-badge color="secondary" :label="user.Rol"  style="width: 74px;"/>
              </q-item-section>
            </q-item>

            <q-item v-if="usuariosFiltrados.length === 0">
              <q-item-section class="text-grey text-center">
                No se encontraron usuarios
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-card>
  </div>

  <q-dialog v-model="UserInfo" persistent>
  <q-card style="min-width: 550px">
    <q-card-section class="row items-center bg-primary text-white">
      <q-icon :name="esEdicion ? 'edit' : 'person_add'" size="30px" class="q-mr-sm" />
      <div class="text-h6">
        {{ esEdicion ? `Editar: ${usuarioSeleccionado?.Usuario}` : 'Registrar Nuevo Usuario' }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <q-form class="q-gutter-md">
        <div class="row q-col-gutter-sm">
          <div class="col-4">
             <q-input v-model="formModel.Usuario" label="Nombre de Usuario" dense />
          </div>
          <div class="col-4">
             <q-input v-model="formModel.Rol" label="Rol de Usuario" dense />
          </div>
          <div class="col-4" v-if="!esEdicion">
            <q-input v-model="formModel.Password" label="Contraseña" type="password" dense />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle2 text-primary q-mb-xs">Acceso para Editar:</div>
      <div class="row">
        <q-checkbox v-for="opt in permisosEdit" :key="opt.val" v-model="formModel[opt.val]" :label="opt.label" class="col-4" />
      </div>
      
      <q-separator class="q-my-md" />

      <div class="text-subtitle2 text-secondary q-mb-xs">Acceso para Visualizar:</div>
      <div class="row">
        <q-checkbox v-for="opt in permisosVer" :key="opt.val" v-model="formModel[opt.val]" :label="opt.label" class="col-4" />
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pb-md q-pr-md">
      <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
      <q-btn 
        unelevated 
        :label="esEdicion ? 'Actualizar Permisos' : 'Crear Usuario'" 
        :color="esEdicion ? 'orange-9' : 'primary'" 
        @click="ejecutarGuardado" 
      />
    </q-card-actions>
  </q-card>
</q-dialog>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue' // Añadimos computed
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const router = useRouter()

// --- ESTADO ---
const search = ref('')
const usuarios = ref([])
const loading = ref(false)
const UserInfo = ref(false)     // Controla el diálogo
const esEdicion = ref(false)    // Switch entre Registro y Edición
const usuarioSeleccionado = ref(null)

const formModel = ref({
  Usuario: '',
  Rol:'',
  Password: '',
  edit_gage: false,
  edit_gageId: false,
  edit_calibracion: false,
  edit_reportes: false,
  edit_procedimientos: false,
  ver_gage: false,
  ver_calibracion: false,
  ver_reportes: false,
  ver_procedimientos: false
})

const permisosEdit = [
  { label: 'Gage Master', val: 'edit_gage' },
  { label: 'Gage ID', val: 'edit_gageId' },
  { label: 'Calibración', val: 'edit_calibracion' },
  { label: 'Reportes', val: 'edit_reportes' },
  { label: 'Procedimientos', val: 'edit_procedimientos' }
]

const permisosVer = [
  { label: 'Gage Master', val: 'ver_gage' },
  { label: 'Calibración', val: 'ver_calibracion' },
  { label: 'Reportes', val: 'ver_reportes' },
  { label: 'Procedimientos', val: 'ver_procedimientos' }
]

// --- LÓGICA DE NAVEGACIÓN ---
function index() {
  router.push('/')
}

// --- API: OBTENER DATOS ---
const obtenerUsuarios = async () => {
  loading.value = true
  try {
    const respuesta = await api.get('/api/usuarios')
    usuarios.value = respuesta.data
  } catch (error) {
    console.error('Error al traer usuarios:', error)
  } finally {
    loading.value = false
  }
}

// --- BUSCADOR FILTRADO ---
// Esta función filtra la lista de usuarios automáticamente según lo que escribas
const usuariosFiltrados = computed(() => {
  if (!search.value) return usuarios.value
  return usuarios.value.filter(user => 
    user.Usuario.toLowerCase().includes(search.value.toLowerCase()) ||
    user.Rol.toLowerCase().includes(search.value.toLowerCase())
  )
})

// --- GESTIÓN DEL DIÁLOGO ---


const limpiarFormulario = () => {
  formModel.value = {
    Usuario: '', Rol: '', Password: '',
    edit_gage: false, edit_gageId: false, edit_calibracion: false, edit_reportes: false, edit_procedimientos: false,
    ver_gage: false, ver_calibracion: false, ver_reportes: false, ver_procedimientos: false
  }
}

const AbrirRegistro = () => {
  esEdicion.value = false
  usuarioSeleccionado.value = null
  limpiarFormulario()
  UserInfo.value = true
}

const abrirDetalle = (user) => {
  esEdicion.value = true
  usuarioSeleccionado.value = user
  
  // Sincronizamos el modelo con los datos del usuario (!! convierte 1/0 a true/false)
  formModel.value = {
    ...user,
    edit_gage: !!user.edit_gage,
    edit_gageId: !!user.edit_gageId,
    edit_calibracion: !!user.edit_calibracion,
    edit_reportes: !!user.edit_reportes,
    edit_procedimientos: !!user.edit_procedimientos,
    ver_gage: !!user.ver_gage,
    ver_calibracion: !!user.ver_calibracion,
    ver_reportes: !!user.ver_reportes,
    ver_procedimientos: !!user.ver_procedimientos
  }
  UserInfo.value = true
}
const ejecutarGuardado = () => {
  // Validación básica
  if (!formModel.value.Usuario || (!esEdicion.value && !formModel.value.Password)) {
    $q.notify({ type: 'warning', message: 'Por favor completa los campos obligatorios' })
    return
  }
  
  if (esEdicion.value) {
    actualizarPermisos()
  } else {
    AgregarUsuario()
  }
}

const actualizarPermisos = async () => {
  $q.loading.show({ message: 'Actualizando permisos...' })
  try {
    // Solo enviamos los campos de permisos para el PUT
    await api.put(`/api/usuarios/${usuarioSeleccionado.value.UserID}`, formModel.value)
    $q.notify({ type: 'positive', message: 'Datos y Permisos Actualizados' })
    UserInfo.value = false
    obtenerUsuarios()
  } catch (error) {
    console.error('Error al actualizar:', error)
    $q.notify({ type: 'negative', message: 'Error al actualizar usuario' })
  } finally {
    $q.loading.hide()
  }
}

 const AgregarUsuario = async () => {
  $q.loading.show({ message: 'Registrando nuevo usuario...' })
  try {
    const res = await api.post('/api/usuarios/registro', formModel.value)
    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Usuario Creado Correctamente' })
      UserInfo.value = false
      obtenerUsuarios()
    }
  } catch (error) {
    console.error('Error al crear usuario:', error)
    $q.notify({ type: 'negative', message: 'Error al registrar usuario' })
  } finally {
    $q.loading.hide()
  }
}


// --- INICIO ---
onMounted(() => {
  obtenerUsuarios()
})
</script>
