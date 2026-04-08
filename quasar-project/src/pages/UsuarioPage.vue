<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h2 flex flex-center" style="font-weight: bold">Usuarios</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="max-width: 750px; width: 100%; margin: 0 auto; margin-top: 20px; padding: 20px">
      <div class="col-12 col-md-6">
        <q-input v-model="search" filled placeholder="BUSCAR POR NOMBRE O ROL"> <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      
      <div class="col-12 col-md-6">
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
                <q-item-label caption>ID: {{ user.UserID }}</q-item-label>
                <q-item-label>{{ user.Usuario }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-badge color="secondary" :label="user.Rol"  style="width: 50px;"/>
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

  <q-dialog v-model="UserInfo" >
    <q-card style="min-width: 550px">
        <q-card-section class="row items-center">
          <q-icon name="account_circle" size="50px" color="primary" style="margin-right: 10px;" />
          <h5 class="q-ma-none">{{ usuarioSeleccionado?.Usuario || 'Usuario' }}</h5>
        </q-card-section>
        
        <q-separator />

      <q-card-section>
        <div class="text-h6 text-primary" style="margin-bottom: 10px;">
          Acceso para Editar:
        </div> 
        <q-checkbox v-model="EDIT_Gage" label="Gage Master" />
        <q-checkbox v-model="EDIT_Calibracion" label="Calibración" />
        <q-checkbox v-model="EDIT_Reportes" label="Reportes" />
        <q-checkbox v-model="EDIT_Procedimientos" label="Procedimientos" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6 text-secondary" style="margin-bottom: 10px;">
          Acceso para Visualizar:
        </div> 
        <q-checkbox v-model="VER_Gage" label="Gage Master" />
        <q-checkbox v-model="VER_Calibracion" label="Calibración" />
        <q-checkbox v-model="VER_Reportes" label="Reportes" />
        <q-checkbox v-model="VER_Procedimientos" label="Procedimientos" />
      </q-card-section>
        
        <q-card-actions align="right" style="margin-right: 10px; margin-bottom: 10px;">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn unelevated label="Guardar Cambios" color="primary" @click="actualizarPermisos" />
        </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue' // Añadimos computed
import { api } from 'boot/axios'

const router = useRouter()

// --- ESTADO ---
const search = ref('')
const usuarios = ref([])
const UserInfo = ref(false)
const loading = ref(false)
const usuarioSeleccionado = ref(null)

// --- PERMISOS (Variables para los checkboxes) ---
const EDIT_Gage = ref(false)
const EDIT_Calibracion = ref(false)
const EDIT_Reportes = ref(false)
const EDIT_Procedimientos = ref(false)
const VER_Gage = ref(false)
const VER_Calibracion = ref(false)
const VER_Reportes = ref(false)
const VER_Procedimientos = ref(false)

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
function abrirDetalle(user) {
  usuarioSeleccionado.value = user
  UserInfo.value = true
  
  // Sincronizamos los checkboxes con los datos de la base de datos
  // Usamos !! para convertir el 1/0 de MySQL a true/false de JavaScript
  EDIT_Gage.value = !!user.edit_gage
  EDIT_Calibracion.value = !!user.edit_calibracion
  EDIT_Reportes.value = !!user.edit_reportes
  EDIT_Procedimientos.value = !!user.edit_procedimientos
  
  VER_Gage.value = !!user.ver_gage
  VER_Calibracion.value = !!user.ver_calibracion
  VER_Reportes.value = !!user.ver_reportes
  VER_Procedimientos.value = !!user.ver_procedimientos
}

const actualizarPermisos = async () => {
  try {
    const datos = {
      edit_gage: EDIT_Gage.value,
      edit_calibracion: EDIT_Calibracion.value,
      edit_reportes: EDIT_Reportes.value,
      edit_procedimientos: EDIT_Procedimientos.value,
      ver_gage: VER_Gage.value,
      ver_calibracion: VER_Calibracion.value,
      ver_reportes: VER_Reportes.value,
      ver_procedimientos: VER_Procedimientos.value
    }

    await api.put(`/api/usuarios/${usuarioSeleccionado.value.UserID}`, datos)
    UserInfo.value = false // Cierra el diálogo
      obtenerUsuarios()     // Refresca la lista
      alert('Permisos actualizados correctamente')
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('Hubo un error al guardar los cambios')
    }
  }


// --- INICIO ---
onMounted(() => {
  obtenerUsuarios()
})
</script>
