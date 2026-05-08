<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      
      <div class="row items-center q-mb-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Configuración de Apoyo</div>
      </div>

      <q-card class="my-card shadow-2">
        <q-splitter v-model="splitterModel" style="min-height: 600px">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary" align="left">
              <q-tab name="Turnos" icon="schedule" label="Turnos" />
              <q-tab name="Patron" icon="article" label="Patrones" />
              <q-tab name="frecuencia" icon="date_range" label="Frecuencias" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels v-model="tab" animated vertical transition-prev="fade" transition-next="fade">
              
              <q-tab-panel name="Turnos">
                <div class="row items-center q-mb-md">
                  <div class="text-h6 text-weight-bold">Catálogo de Turnos</div>
                  <q-space />
                  <q-btn color="primary" icon="add" label="Agregar Turno" @click="nuevoTurno" />
                </div>
                <q-table
                  :rows="Turnos"
                  :columns="columnasTurnos"
                  row-key="TurnoId"
                  flat bordered
                  :loading="loading"
                />
              </q-tab-panel>

              <q-tab-panel name="Patron">
                <div class="row items-center q-mb-md">
                  <div class="text-h6 text-weight-bold">Maestro de Patrones</div>
                  <q-space />
                  <q-btn color="primary" icon="add" label="Nuevo Patrón" @click="nuevoPatron" />
                </div>
                <q-table
                  :rows="Patrones"
                  :columns="columnasPatrones"
                  row-key="PatronId"
                  flat bordered
                  :loading="loading"
                />
              </q-tab-panel>

              <q-tab-panel name="frecuencia">
                <div class="row items-center q-mb-md">
                  <div class="text-h6 text-weight-bold">Frecuencias de Calibración</div>
                  <q-space />
                  <q-btn color="primary" icon="add" label="Nueva Frecuencia" @click="nuevaFrec" />
                </div>
                <q-table
                  :rows="frecuencias"
                  :columns="columnasFrecuencias"
                  row-key="FreqId"
                  flat bordered
                  :loading="loading"
                />
              </q-tab-panel>

            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const tab = ref('Turnos')
const splitterModel = ref(15)

function index() {
  router.push('/')
}

const Turnos = ref([])
const Patrones = ref([])
const frecuencias = ref([])

// //modelo para formularios
// const TurnoModel = ref({
//   TurnoId: '',
//   TurnoNombre: '',
// })

// const PatronModel = ref({
//   PatronId: '',
//   PatronCodigo: '',
//   Descripcion: '',
//   FechaVencimiento: '',
//   Estatus: '',
// })

// const frecuenciaModel = ref({
//   freqId: '',
//   NomFreq: '',
//   ValorMeses: '',
// })

// DEFINICIÓN DE COLUMNAS
const columnasTurnos = [
  { name: 'id', align: 'left', label: 'ID', field: 'TurnoId', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre del Turno', field: 'TurnoNombre', sortable: true }
]

const columnasPatrones = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'CodigoPatron', sortable: true },
  { name: 'desc', align: 'left', label: 'Descripción', field: 'Descripcion', sortable: true },
  { name: 'vencimiento', align: 'center', label: 'Vencimiento', field: 'FechaVencimiento', format: val => new Date(val).toLocaleDateString() },
  { name: 'estatus', align: 'center', label: 'Estatus', field: 'Estatus' }
]

const columnasFrecuencias = [
  { name: 'nombre', align: 'left', label: 'Frecuencia', field: 'NomFreq', sortable: true },
  { name: 'meses', align: 'center', label: 'Valor (Meses)', field: 'ValorMeses', sortable: true }
]

// FUNCIONES DE CARGA
const obtenerDatos = async () => {
  loading.value = true
  try {
    const [resT, resP, resF] = await Promise.all([
      api.get('/api/turnos'),
      api.get('/api/patrones'),
      api.get('/api/frecuencias')
    ])
    Turnos.value = resT.data
    Patrones.value = resP.data
    frecuencias.value = resF.data
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Error al cargar catálogos' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  obtenerDatos()
})
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
/* Estilo para cabecera fija */
.tabla-sticky {
  height: 430px; /* Ajusta esta altura según prefieras */
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
