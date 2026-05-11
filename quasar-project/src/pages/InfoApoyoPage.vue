<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      <div class="row items-center q-mb-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Configuración de Apoyo</div>
      </div>

      <q-card class="my-card shadow-2 q-mb-md" style="height: 570px;">
        <q-splitter v-model="splitterModel" style="min-height: 570px">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="text-primary" align="left">
              <q-tab name="Turnos" icon="schedule" label="Turnos" />
              <q-tab name="Patron" icon="article" label="Patrones" />
              <q-tab name="frecuencia" icon="date_range" label="Frecuencias" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              vertical
              transition-prev="fade"
              transition-next="fade"
            >
              <q-tab-panel name="Turnos">
                <div class="row justify-between items-center q-mb-md">
                  <div class="text-h6 text-grey-8">Listado de {{ configCatalogos[tab].label }}s</div>
                  <q-btn 
                    color="primary" 
                    icon="add" 
                    :label="'Nuevo ' + configCatalogos[tab].label" 
                    @click="abrirFormulario()" 
                  />
                </div>
                <q-table
                  :rows="Turnos"
                  :columns="columnasTurnos"
                  row-key="TurnoId"
                  flat
                  bordered
                  :loading="loading"
                >
                  <template v-slot:body-cell-acciones="props">
                    <q-td :props="props" class="q-gutter-sm text-center">
                      <q-btn
                        outline
                        round
                        dense
                        color="warning"
                        icon="edit"
                        @click="abrirFormulario(props.row)"
                      >
                        <q-tooltip>EDITAR</q-tooltip>
                      </q-btn>
                      <q-btn
                        outline
                        round
                        dense
                        color="negative"
                        icon="delete"
                        @click="eliminar(props.row)"
                      >
                        <q-tooltip>BORRAR</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="Patron">
                <div class="row justify-between items-center q-mb-md">
                  <div class="text-h6 text-grey-8">Listado de {{ configCatalogos[tab].label }}s</div>
                  <q-btn 
                    color="primary" 
                    icon="add" 
                    :label="'Nuevo ' + configCatalogos[tab].label" 
                    @click="abrirFormulario()" 
                  />
                </div>
                <q-table
                  :rows="Patrones"
                  :columns="columnasPatrones"
                  row-key="PatronId"
                  flat
                  bordered
                  :loading="loading"
                >
                  <template v-slot:body-cell-acciones="props">
                    <q-td :props="props" class="q-gutter-sm text-center">
                      <q-btn
                        outline
                        round
                        dense
                        color="warning"
                        icon="edit"
                        @click="abrirFormulario(props.row)"
                      >
                        <q-tooltip>EDITAR</q-tooltip>
                      </q-btn>
                      <q-btn
                        outline
                        round
                        dense
                        color="negative"
                        icon="delete"
                        @click="eliminar(props.row)"
                      >
                        <q-tooltip>BORRAR</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="frecuencia">
                <div class="row justify-between items-center q-mb-md">
                  <div class="text-h6 text-grey-8">Listado de {{ configCatalogos[tab].label }}s</div>
                  <q-btn 
                    color="primary" 
                    icon="add" 
                    :label="'Nuevo ' + configCatalogos[tab].label" 
                    @click="abrirFormulario()" 
                  />
                </div>
                <q-table
                  :rows="frecuencias"
                  :columns="columnasFrecuencias"
                  row-key="FreqId"
                  flat
                  bordered
                  :loading="loading"
                >
                  <template v-slot:body-cell-acciones="props">
                    <q-td :props="props" class="q-gutter-sm text-center">
                      <q-btn
                        outline
                        round
                        dense
                        color="warning"
                        icon="edit"
                        @click="abrirFormulario(props.row)"
                      >
                        <q-tooltip>EDITAR</q-tooltip>
                      </q-btn>
                      <q-btn
                        outline
                        round
                        dense
                        color="negative"
                        icon="delete"
                        @click="eliminar(props.row)"
                      >
                        <q-tooltip>BORRAR</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card>
    </div>

    <q-dialog v-model="modalAbierto" persistent>
      <q-card style="min-width: 350px; border-radius: 15px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ esEdicion ? 'Editar' : 'Nuevo' }} {{ configCatalogos[tab].label }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div v-if="tab === 'Turnos'" class="q-gutter-md">
            <q-input v-model="form.TurnoNombre" label="Nombre del Turno" outlined dense />
          </div>

          <div v-if="tab === 'Patron'" class="q-gutter-md">
            <q-input v-model="form.CodigoPatron" label="Código del Patrón" outlined dense />
            <q-input v-model="form.Descripcion" label="Descripción" outlined dense />
            <q-input v-model="form.FechaVencimiento" label="Vencimiento" mask="date" outlined dense stack-label>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"
                  ><q-popup-proxy><q-date v-model="form.FechaVencimiento" /></q-popup-proxy
                ></q-icon>
              </template>
            </q-input>
          </div>

          <div v-if="tab === 'frecuencia'" class="q-gutter-md">
            <q-input v-model="form.NomFreq" label="Nombre Frecuencia" outlined dense />
            <q-input v-model="form.ValorMeses" label="Meses" type="number" outlined dense />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn 
            :label="esEdicion ? 'Actualizar' : 'Guardar'" 
            color="primary" 
            @click="guardar" 
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const tab = ref('Turnos')
const splitterModel = ref(15)

const Turnos = ref([])
const Patrones = ref([])
const frecuencias = ref([])

//ESTADO DEL FORMULARIO
const modalAbierto = ref(false)
const esEdicion = ref(false)
const form = ref({})

//MODELOS
const modelos = {
  Turnos: { TurnoId: null, TurnoNombre: '' },
  Patron: { PatronId: null, CodigoPatron: '', Descripcion: '', FechaVencimiento: '', Estatus: 'Activo' },
  frecuencia: { FreqId: null, NomFreq: '', ValorMeses: 0 }
}

//CATALAGOS
const configCatalogos = {
  Turnos: { 
    endpoint: '/api/turnos', 
    idField: 'TurnoId', 
    label: 'Turno',
    model: modelos.Turnos 
  },
  Patron: { 
    endpoint: '/api/patrones', 
    idField: 'PatronId', 
    label: 'Patrón',
    model: modelos.Patron 
  },
  frecuencia: { 
    endpoint: '/api/frecuencias', 
    idField: 'FreqId', 
    label: 'Frecuencia',
    model: modelos.frecuencia 
  }
}



function index() {
  router.push('/')
}


// DEFINICIÓN DE COLUMNAS
const columnasTurnos = [
  { name: 'id', align: 'left', label: 'ID', field: 'TurnoId', sortable: true },
  { name: 'nombre', align: 'left', label: 'Nombre del Turno', field: 'TurnoNombre', sortable: true},
  { name: 'acciones', align: 'center', label: 'Acciones'},
]

const columnasPatrones = [
  { name: 'codigo', align: 'left', label: 'Código', field: 'CodigoPatron', sortable: true },
  { name: 'desc', align: 'left', label: 'Descripción', field: 'Descripcion', sortable: true },
  { name: 'vencimiento', align: 'center', label: 'Vencimiento', field: 'FechaVencimiento',format: (val) => new Date(val).toLocaleDateString()},
  { name: 'estatus', align: 'center', label: 'Estatus', field: 'Estatus' },
  { name: 'acciones', align: 'center', label: 'Acciones'},
]

const columnasFrecuencias = [
  { name: 'nombre', align: 'left', label: 'Frecuencia', field: 'NomFreq', sortable: true },
  { name: 'meses', align: 'center', label: 'Valor (Meses)', field: 'ValorMeses', sortable: true },
  { name: 'acciones', align: 'center', label: 'Acciones'},
]



// FUNCIONES DE CARGA
const obtenerDatos = async () => {
  loading.value = true
  try {
    const [resT, resP, resF] = await Promise.all([
      api.get('/api/turnos'),
      api.get('/api/patrones'),
      api.get('/api/frecuencias'),
    ])
    Turnos.value = resT.data
    Patrones.value = resP.data
    frecuencias.value = resF.data
  } catch (error) {
     console.error('Error al traer gages:', error)
    $q.notify({ color: 'negative', message: 'Error al cargar catálogos' })
  } finally {
    loading.value = false
  }
}

const refrescarActual = async () => {
  const config = configCatalogos[tab.value]
  try {
    const res = await api.get(config.endpoint)
    if (tab.value === 'Turnos') Turnos.value = res.data
    if (tab.value === 'Patron') Patrones.value = res.data
    if (tab.value === 'frecuencia') frecuencias.value = res.data
  } catch (e) { console.error(e) }
}

const abrirFormulario = (item = null) => {
  if (item) {
    // Si recibimos un item, es EDICIÓN
    esEdicion.value = true
    form.value = { ...item } // Clonamos el objeto para no editar la tabla en vivo
  } else {
    // Si no hay item, es NUEVO
    esEdicion.value = false
    // Usamos el modelo vacío que definimos en la configuración
    form.value = { ...configCatalogos[tab.value].model }
  }
  modalAbierto.value = true // ¡Aquí se abre el form!
}

const guardar = async () => {
  const config = configCatalogos[tab.value]
  const id = form.value[config.idField]
  loading.value = true
  try {
    if (esEdicion.value) {
      await api.put(`${config.endpoint}/${id}`, form.value)
    } else {
      await api.post(config.endpoint, form.value)
    }
    $q.notify({ color: 'positive', message: 'Guardado correctamente', icon: 'check' })
    modalAbierto.value = false
    refrescarActual()
  } catch (error) {
    console.error('Error al traer gages:', error)
    $q.notify({ color: 'negative', message: 'Error al guardar' })
  } finally {
    loading.value = false
  }
}

const eliminar = (item) => {
  const config = configCatalogos[tab.value]
  const id = item[config.idField]
  $q.dialog({
    title: 'Confirmar',
    message: `¿Borrar este ${config.label}?`,
    cancel: true,
    ok: { color: 'negative', label: 'Eliminar' }
  }).onOk(async () => {
    try {
      // Usamos PUT porque tu backend tiene router.put('/delete/:id')
      await api.put(`${config.endpoint}/delete/${id}`)
      $q.notify({ color: 'positive', message: 'Eliminado' })
      refrescarActual()
    } catch (e) {
       console.e('Error al traer gages:', e)
      $q.notify({ color: 'negative', message: 'Error al eliminar' })
    }
  })
}

onMounted(obtenerDatos)
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
