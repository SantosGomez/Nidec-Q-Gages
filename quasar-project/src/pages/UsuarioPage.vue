<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      <div class="row items-center q-mb-xl">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <!-- Corregido: "Gestión de Usuarios" en lugar de Gages -->
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Gestión de Usuarios</div>
        <q-space />
        <q-btn
          v-if="puedeEditar"
          padding="sm lg"
          color="primary"
          icon="person_add"
          label="Nuevo Usuario"
          @click="AbrirRegistro()"
        />
      </div>

      <q-card class="my-card shadow-1 shadow-up-1">
        <q-table
          :rows="usuariosFiltrados"
          :columns="columns"
          :loading="loading"
          row-key="UserID"
          flat
          dense
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:top-right>
            <q-input v-model="search" dense outlined debounce="300" placeholder="Buscar usuario...">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- Slot para el Rol con Badge -->
          <template v-slot:body-cell-Rol="props">
            <q-td :props="props">
              <q-badge
                :color="props.value === 'SuperAdmin' ? 'purple-7' : 'secondary'"
                class="text-weight-bold"
                style="min-width: 80px; justify-content: center"
              >
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>

          <!-- Slot para Acciones -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn
                outline
                round
                dense
                color="warning"
                icon="edit"
                @click="abrirDetalle(props.row)"
              >
                <q-tooltip>Editar Permisos</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                dense
                color="info"
                icon="visibility"
                @click="abrirDetalle(props.row, true)"
              >
                <q-tooltip>Ver Detalles</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>

  <q-dialog v-model="UserInfo" persistent>
    <q-card style="min-width: 600px">
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon
          :name="!puedeEditar ? 'visibility' : esEdicion ? 'edit' : 'person_add'"
          size="30px"
          class="q-mr-sm"
        />
        <div class="text-h6">
          {{
            esEdicion
              ? puedeEditar
                ? `Editar: ${usuarioSeleccionado?.Usuario}`
                : `Detalles: ${usuarioSeleccionado?.Usuario}`
              : 'Registrar Nuevo Usuario'
          }}
        </div>
        <q-btn
          v-if="esEdicion && authStore.usuario?.Rol === 'SuperAdmin'"
          color="white"
          flat
          round
          icon="more_horiz"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="abrirReset">
                <q-item-section avatar>
                  <q-icon color="primary" name="lock_reset" size="sm" />
                </q-item-section>
                <q-item-section>Resetear Contraseña</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-banner v-if="!puedeEditar" class="bg-amber-1 text-amber-9 q-mb-md" rounded dense>
            <template v-slot:avatar>
              <q-icon name="lock" />
            </template>
            Modo de solo lectura. No tienes permisos para modificar usuarios.
          </q-banner>
          <div class="row q-col-gutter-sm">
            <div
              class="col-4"
              v-if="authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'"
            >
              <q-input v-model="formModel.Usuario" label="Nombre de Usuario" dense />
            </div>
            <div class="col-4">
              <q-input
                v-model="formModel.Rol"
                label="Rol de Usuario"
                dense
                :disable="!puedeEditar"
              />
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
          <q-checkbox
            v-for="opt in permisosEdit"
            :key="opt.val"
            v-model="formModel[opt.val]"
            :label="opt.label"
            class="col-4"
            :disable="!puedeEditar"
          />
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle2 text-secondary q-mb-xs">Acceso para Visualizar:</div>
        <div class="row">
          <q-checkbox
            v-for="opt in permisosVer"
            :key="opt.val"
            v-model="formModel[opt.val]"
            :label="opt.label"
            class="col-4"
            :disable="!puedeEditar"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          v-if="authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'"
          unelevated
          :label="esEdicion ? 'Actualizar Permisos' : 'Crear Usuario'"
          :color="esEdicion ? 'orange' : 'primary'"
          @click="ejecutarGuardado"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="promptReset" :backdrop-filter="'blur(4px) brightness(60%)'" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Nueva Contraseña para {{ usuarioSeleccionado?.Usuario }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="nuevaPassword"
          autofocus
          type="password"
          label="Escribe la nueva Contraseña"
          @keyup.enter="ejecutarReset"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn flat label="Cambiar Contraseña" @click="ejecutarReset" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue' // Añadimos computed
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth' // Importamos

const $q = useQuasar()
const router = useRouter()

// --- ESTADO ---
const search = ref('')
const usuarios = ref([])
const loading = ref(false)
const UserInfo = ref(false) // Controla el diálogo
const esEdicion = ref(false) // Switch entre Registro y Edición
const usuarioSeleccionado = ref(null)
const authStore = useAuthStore()
const promptReset = ref(false)
const nuevaPassword = ref('')

const columns = [
  { name: 'Usuario', label: 'Nombre de Usuario', field: 'Usuario', align: 'left', sortable: true },
  { name: 'Rol', label: 'Rol / Nivel', field: 'Rol', align: 'center', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center' },
]

const formModel = ref({
  Usuario: '',
  Rol: '',
  Password: '',
  edit_gage: false,
  edit_gageId: false,
  edit_calibracion: false,
  edit_reportes: false,
  edit_procedimientos: false,
  ver_gage: false,
  ver_calibracion: false,
  ver_reportes: false,
  ver_procedimientos: false,
})

const permisosEdit = [
  { label: 'Gage Master', val: 'edit_gage' },
  { label: 'Gage ID', val: 'edit_gageId' },
  { label: 'Calibración', val: 'edit_calibracion' },
  { label: 'Reportes', val: 'edit_reportes' },
  { label: 'Procedimientos', val: 'edit_procedimientos' },
  { label: 'Prestamo', val: 'edit_prestamo' },
]

const permisosVer = [
  { label: 'Gage Master', val: 'ver_gage' },
  { label: 'Calibración', val: 'ver_calibracion' },
  { label: 'Reportes', val: 'ver_reportes' },
  { label: 'Procedimientos', val: 'ver_procedimientos' },
  { label: 'Prestamo', val: 'ver_prestamo' },
]

const puedeEditar = computed(() => {
  return authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'
})

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
  return usuarios.value.filter(
    (user) =>
      user.Usuario.toLowerCase().includes(search.value.toLowerCase()) ||
      user.Rol.toLowerCase().includes(search.value.toLowerCase()),
  )
})

// --- GESTIÓN DEL DIÁLOGO ---

const limpiarFormulario = () => {
  formModel.value = {
    Usuario: '',
    Rol: '',
    Password: '',
    edit_gage: false,
    edit_gageId: false,
    edit_calibracion: false,
    edit_reportes: false,
    edit_procedimientos: false,
    edit_prestamo: false,
    ver_gage: false,
    ver_calibracion: false,
    ver_reportes: false,
    ver_procedimientos: false,
    ver_prestamo: false,
  }
}

const AbrirRegistro = () => {
  esEdicion.value = false
  usuarioSeleccionado.value = null
  limpiarFormulario()
  UserInfo.value = true
}

const abrirReset = () => {
  nuevaPassword.value = ''
  promptReset.value = true
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
    edit_prestamo: !!user.edit_prestamo,
    ver_gage: !!user.ver_gage,
    ver_calibracion: !!user.ver_calibracion,
    ver_reportes: !!user.ver_reportes,
    ver_procedimientos: !!user.ver_procedimientos,
    ver_prestamo: !!user.ver_prestamo,
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

const ejecutarReset = async () => {
  if (nuevaPassword.value.length < 4) {
    $q.notify({ type: 'warning', message: 'La contraseña es muy corta' })
    return
  }

  $q.loading.show({ message: 'Cambiando contraseña...' })
  try {
    await api.put(`/api/usuarios/${usuarioSeleccionado.value.UserID}/reset-password`, {
      Password: nuevaPassword.value,
    })

    $q.notify({ type: 'positive', message: '¡Contraseña actualizada!' })
    promptReset.value = false
  } catch (error) {
    console.error('Error al resetear contraseña del usuario:', error)
    $q.notify({ type: 'negative', message: 'No se pudo resetear' })
  } finally {
    $q.loading.hide()
  }
}

// --- INICIO ---
onMounted(() => {
  obtenerUsuarios()
})
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.tabla-sticky {
  height: 450px; /* Ajusta esta altura según prefieras */
}
.tabla-sticky :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f5f5f5; /* Asegura que el fondo de la cabecera sea sólido */
}

.tabla-sticky :deep(thead tr:first-child th) {
  top: 0;
}
.q-table__container {
  border-radius: 8px;
}
</style>
