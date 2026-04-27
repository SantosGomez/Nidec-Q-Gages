<template>
  <div class="q-pa-md">
    <div class="q-mb-lg">
      <q-btn color="primary" icon="home" label="Inicio" @click="index" />
    </div>

    <div class="text-h4 q-mb-md text-center text-weight-bolder">Manuales De Procedimientos</div>
    <div class="col-12 col-md-6 flex flex-center" style="margin: 20px">
      <q-input
        v-model="search"
        filled
        placeholder="BUSCAR PROCEDIMIENTO"
        class="bg-white"
        style="width: 100%; max-width: 400px"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="row q-col-gutter-md justify-center">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="procedimiento in filteredProcedimientos"
        :key="procedimiento.ProceId"
      >
        <q-card class="my-card cursor-pointer q-hoverable" @click="abrirDetalle(procedimiento)">
          <span class="q-focus-helper"></span>
          <q-card-section class="text-center bg-primary text-white">
            <q-icon name="settings_input_component" size="4rem" />
            <div class="text-h6">{{ procedimiento.NombreProce }}</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat color="primary" label="Ver Procedimiento" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog
      v-model="procedimientoInfo"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-bar class="bg-primary text-white q-pa-lg">
          <div class="text-h6">{{ procedimientoSeleccionado?.NombreProce || 'NombreProce' }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h5 q-mb-sm">Instrucciones de Calibración</div>
              <p class="text-body1">{{ procedimientoSeleccionado?.DescripcionProce }}</p>

              <q-banner rounded class="bg-amber-1 q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="warning" color="amber-9" />
                </template>
                Asegúrese de desconectar la fuente de poder antes de iniciar.
              </q-banner>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h5 q-mb-sm">Apoyo Visual</div>
              <q-img
                :src="'/procedimientos/' + procedimientoSeleccionado?.ImgProce"
                class="rounded-borders shadow-2"
                style="max-height: 300px"
              />
              <q-btn
                color="red-9"
                icon="picture_as_pdf"
                label="Abrir Manual PDF Completo"
                class="full-width q-mt-md"
                @click="viewPDF(currentManual.pdfUrl)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="AgregarProcedimiento" />
    </q-page-sticky>
  </div>
  
  <q-dialog v-model="NuevoProcedimiento" persistent>
    <q-card style="min-width: 300px; max-width: 500px">
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon size="md" name="import_contacts" color="white" />
        <span class="q-ml-md">Agregar Nuevo Procedimiento</span>
      </q-card-section>
      <q-card-section class="row items-center">
        <div class="row">
          <div class="col-12 q-mb-md">
            <q-input v-model="text" type="text" label="Nombre del procedimiento" />
          </div>
          <div class="col-12 q-mb-md">
            <q-editor v-model="editor" min-height="5rem" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// Estado reactivo para la búsqueda, el modal y el procedimiento de calibración actual
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'

const search = ref('')
const procedimientos = ref([])
const loading = ref(false)
const procedimientoSeleccionado = ref(null)
const procedimientoInfo = ref(false)
const NuevoProcedimiento = ref(false)

// Filtro computado para mostrar solo los procedimientos que coinciden con la búsqueda
const filteredProcedimientos = computed(() => {
  if (!search.value) return procedimientos.value
  return procedimientos.value.filter((proc) =>
    proc.NombreProce.toLowerCase().includes(search.value.toLowerCase()),
  )
})

// API para obtener los procedimientos desde el backend
const obtenerProcedimientos = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/procedimientos')
    procedimientos.value = response.data
  } catch (error) {
    console.error('Error al obtener procedimientos:', error)
  } finally {
    loading.value = false
  }
}

const AgregarProcedimiento = () => {
  NuevoProcedimiento.value = true
}

function abrirDetalle(procedimiento) {
  procedimientoSeleccionado.value = procedimiento
  procedimientoInfo.value = true
}

onMounted(() => {
  obtenerProcedimientos()
})

// Datos de ejemplo (Esto podría venir de una API)

function viewPDF(url) {
  window.open(url, '_blank')
}

// Navegación a la página de inicio
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}
</script>
