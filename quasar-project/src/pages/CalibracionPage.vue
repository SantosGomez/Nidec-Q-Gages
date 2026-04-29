<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h3 flex flex-center" style="font-weight: bold">Calibracion De Gages</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card
      class="my-card"
      style="max-width: 1250px; width: 100%; margin: 0 auto; margin-top: 20px"
    >
      <q-card-section>
        <div class="text-h5">Calibraciones</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="rowsFiltradas"
          :columns="columns"
          :filter="search"
          row-key="CalibracionId"
          flat
          bordered
          dense
        >
          <template v-slot:top-left>
            <div class="row q-gutter-md">
              <q-select
                v-model="filtroEstado"
                :options="[
                  'Todos',
                  'NUEVO',
                  'CALIBRADO',
                  'PROXIMO A CALIBRAR',
                  'VENCIDO',
                  'RECHAZADO',
                ]"
                label="Filtrar por Estado"
                dense
                outlined
                style="min-width: 170px"
              />

              <q-input dense outlined v-model="fechaInicioProx" label="Vence Desde" mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="fechaInicioProx">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="OK" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input dense outlined v-model="fechaFinProx" label="Vence Hasta" mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="fechaFinProx">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="OK" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-btn
                v-if="fechaInicioProx || fechaFinProx"
                flat
                round
                dense
                icon="event_busy"
                color="negative"
                @click="
                  fechaInicioProx = '';
                  fechaFinProx = ''
                "
              >
                <q-tooltip>Limpiar Rango de Vencimiento</q-tooltip>
              </q-btn>
            </div>
          </template>

          <template v-slot:top-right>
            <q-input v-model="search" dense outlined debounce="300" placeholder="Buscar Gage">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :class="obtenerClaseFila(props.row)">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'FechaCalibracion' || col.name === 'FechaProxima'">
                  {{ formatearFecha(props.row[col.field]) }}
                </template>

                <template v-else-if="col.name === 'Calibracion'">
                  <q-badge
                    v-if="props.row.EsNuevo === 1"
                    color="blue-7"
                    class="text-weight-bold"
                    label="NUEVO / PENDIENTE"
                  />

                  <q-badge
                    v-else-if="calcularDias(props.row.FechaProxima) <= 0"
                    color="orange-10"
                    class="text-weight-bold"
                    label="VENCIDO / RECALIBRAR"
                  />

                  <q-badge
                    v-else-if="calcularDias(props.row.FechaProxima) <= 7"
                    color="warning"
                    class="text-weight-bold"
                    label="PROXIMO A CALIBRAR"
                  />

                  <q-badge
                    v-else
                    :color="props.row.EstatusPasa === 1 ? 'positive' : 'negative'"
                    class="text-weight-bold"
                  >
                    {{ props.row.EstatusPasa === 1 ? 'CALIBRADO' : 'RECHAZADO' }}
                  </q-badge>
                </template>
                <template v-else-if="col.name === 'Procedimiento'">
                  <q-btn
                    outline
                    round
                    dense
                    color="primary"
                    icon="topic"
                    @click="abrirProcedimiento(props.row)"
                  >
                    <q-tooltip>Manual de Procedimiento</q-tooltip>
                  </q-btn>
                </template>

                <template v-else-if="col.name === 'actions'">
                  <q-btn
                    v-if="
                      authStore.usuario?.edit_gage &&
                      (props.row.EsNuevo === 1 || calcularDias(props.row.FechaProxima) <= 0)
                    "
                    color="positive"
                    icon="build"
                    label="Calibrar"
                    @click="seleccionarParaCalibrar(props.row)"
                  />

                  <div v-else class="q-gutter-xs">
                    <q-btn
                      outline
                      round
                      dense
                      color="warning"
                      icon="edit"
                      @click="prepararEdicion(props.row)"
                      v-if="authStore.usuario?.edit_gage"
                    >
                      <q-tooltip>EDITAR CALIBRACION</q-tooltip>
                    </q-btn>

                    <q-btn
                      outline
                      round
                      dense
                      color="info"
                      icon="visibility"
                      @click="verDetalles(props.row)"
                    >
                      <q-tooltip>VER DETALLES</q-tooltip>
                    </q-btn>
                    <q-btn
                      outline
                      round
                      dense
                      color="primary"
                      icon="build"
                      @click="seleccionarParaCalibrar(props.row)"
                      v-if="authStore.usuario?.edit_gage"
                    >
                      <q-tooltip>CALIBRAR</q-tooltip>
                    </q-btn>
                  </div>
                </template>

                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>

  <!-- dialog de formulario para calibracion de gages -->
  <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
    <q-card class="my-card" style="max-width: 1200px; width: 100%; min-height: 500px">
      <q-card-section class="bg-primary text-white q-pa-sm">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h5">
              {{
                modoEdicion
                  ? 'Editar Calibración'
                  : soloLectura
                    ? 'Detalle de Calibración'
                    : 'Registrar Calibración'
              }}
            </div>
            <div class="text-subtitle2">
              {{ formModel.GageSerie }} - {{ formModel.Descripcion }}
            </div>
          </div>
          <q-btn round dense flat icon="close" v-close-popup>
            <q-tooltip anchor="top middle" self="bottom middle">Cerrar</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-tabs
        v-model="tabActual"
        dense
        class="bg-grey-2 text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="registro" icon="edit" label="Captura / Detalle" />
        <q-tab name="historial" icon="history" label="Historial de este Gage" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tabActual" animated>
        <q-tab-panel name="registro" class="q-pa-md">
          <q-form @submit="onSubmit" @reset="onReset">
              <q-scroll-area style="width: 100%; height: 450px;">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input  v-model="formModel.GageSerie" label="Gage ID" readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input  v-model="formModel.Descripcion" label="Equipo" readonly />
                </div>

                <div class="col-12 col-md-4">
                  <q-input
                    
                    :readonly="soloLectura"
                    v-model="formModel.FolioCertificado"
                    label="No. de Certificado / Folio"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="formModel.E_Pusados"
                    :options="listaPatrones"
                    option-label="CodigoPatron"
                    option-value="CodigoPatron"
                    emit-value
                    map-options
                    multiple
                    use-chips
                    stack-label
                    label="Patrones Utilizados"
                    :readonly="soloLectura"
                    class="col-12 col-md-4"
                    bg-color="white"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey"
                          >No hay patrones disponibles</q-item-section
                        >
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-2">
                  <q-input
                    
                    :readonly="soloLectura"
                    v-model="formModel.Temperatura"
                    label="Temp (°C)"
                    type="number"
                    step="0.1"
                  />
                </div>
                <div class="col-12 col-md-2">
                  <q-input
                    
                    :readonly="soloLectura"
                    v-model="formModel.Humedad"
                    label="Humedad (%)"
                    type="number"
                    step="0.1"
                  />
                </div>

                <div class="col-12 q-mt-md">
                  <div class="text-subtitle1 text-weight-bold q-mb-sm">Puntos de Medición</div>
                  <q-markup-table flat bordered dense>
                    <thead class="bg-blue-grey-1">
                      <tr>
                        <th class="text-left">Categoría</th>
                        <th class="text-left">Nominal</th>
                        <th class="text-left" style="width: 150px">Valor Leído</th>
                        <th class="text-left">Dif.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(med, index) in mediciones" :key="index">
                        <td class="text-blue-9 text-weight-bold">{{ med.Categoria }}</td>
                        <td>{{ med.PuntoNominal }}</td>
                        <td>
                          <q-input
                            v-model.number="med.ValorLeido"
                            type="number"
                            step="0.0001"
                            dense
                            outlined
                            bg-color="white"
                            @update:model-value="calcularDiferencia(index)"
                            :readonly="soloLectura"
                          />
                        </td>
                        <td
                          :class="
                            Math.abs(med.Diferencia) > 0.001
                              ? 'text-red text-weight-bold'
                              : 'text-green'
                          "
                        >
                          {{ med.Diferencia }}
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>

                <div class="col-12 col-md-4">
                  <q-input
                    
                    :readonly="soloLectura"
                    v-model="formModel.CalibracionBy"
                    label="Calibrado por"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <q-input
                    
                    :readonly="soloLectura"
                    v-model="formModel.FechaCalibracion"
                    mask="date"
                    label="Fecha Calibración"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ><q-date v-model="formModel.FechaCalibracion"
                        /></q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-4 flex items-center justify-around">
                  <span class="text-weight-bold">Resultado Final:</span>
                  <q-radio
                    v-model="formModel.EstatusPasa"
                    :val="1"
                    label="APROBADO"
                    color="positive"
                    :disable="soloLectura"
                  />
                  <q-radio
                    v-model="formModel.EstatusPasa"
                    :val="0"
                    label="RECHAZADO"
                    color="negative"
                    :disable="soloLectura"
                  />
                </div>
              </div>
              
            </q-scroll-area>
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  v-if="!soloLectura"
                  :label="modoEdicion ? 'Actualizar' : 'Registrar'"
                  type="submit"
                  color="primary"
                />
              </div>
            </q-form>
        </q-tab-panel>

        <q-tab-panel name="historial" class="q-pa-none">
          <q-table
            flat
            :rows="rowsHistorial"
            :columns="columnsHistorial"
            row-key="CalibracionId"
            placeholder="No hay registros previos"
          >
            <template v-slot:body-cell-EstatusPasa="props">
              <q-td :props="props">
                <q-badge :color="props.value === 1 ? 'positive' : 'negative'">
                  {{ props.value === 1 ? 'PASA' : 'FALLA' }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>

  <!-- dialog de procedimientos de calibracion -->
  <q-dialog
    v-model="procedimientos"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-grey-1">
      <q-bar class="bg-primary text-white q-pa-lg">
        <q-icon name="description" />
        <div class="text-h6">{{ procedimientoSeleccionado?.NombreProce }}</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-scroll-area style="height: calc(100vh - 50px)">
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <q-card flat bordered class="q-mb-md">
                <q-card-section class="bg-blue-grey-1 text-weight-bold">
                  1.0 Propósito y 2.0 Alcance
                </q-card-section>
                <q-card-section>
                  <div class="text-weight-bold text-primary">Propósito:</div>
                  <p>{{ procedimientoSeleccionado?.Proposito }}</p>
                  <q-separator class="q-my-sm" />
                  <div class="text-weight-bold text-primary">Alcance:</div>
                  <p>{{ procedimientoSeleccionado?.Alcance }}</p>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mb-md">
                <q-card-section class="bg-blue-grey-1 text-weight-bold">
                  3.0 Materiales Requeridos
                </q-card-section>
                <q-card-section>
                  <div
                    v-html="procedimientoSeleccionado?.Materiales || 'Sin materiales registrados'"
                  ></div>
                </q-card-section>
              </q-card>

              <q-card flat bordered>
                <q-card-section class="bg-blue-grey-1 text-weight-bold">
                  6.0 Procedimiento y 7.0 Correcciones
                </q-card-section>
                <q-card-section>
                  <div v-html="procedimientoSeleccionado?.Instrucciones"></div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <q-banner rounded class="bg-amber-1 text-amber-10 q-mb-md border-amber">
                <template v-slot:avatar>
                  <q-icon name="warning" color="amber-9" size="md" />
                </template>
                <div class="text-weight-bold">4.0 Precauciones:</div>
                {{ procedimientoSeleccionado?.Precauciones }}
              </q-banner>

              <q-card dark class="bg-indigo-9 q-mb-md">
                <q-card-section>
                  <div class="text-subtitle2">5.0 Tolerancia de Aceptación</div>
                  <div class="text-h5 text-weight-bolder">
                    {{ procedimientoSeleccionado?.Tolerancia }}
                  </div>
                </q-card-section>
              </q-card>

              <div class="text-h6 q-mb-sm"><q-icon name="perm_media" /> Apoyo Visual</div>
              <q-img
                v-if="procedimientoSeleccionado?.ImgProce"
                :src="'http://tu-api-url/uploads/' + procedimientoSeleccionado.ImgProce"
                class="rounded-borders shadow-2 q-mb-md"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">
                    Sin imagen de apoyo
                  </div>
                </template>
              </q-img>

              <q-btn
                v-if="procedimientoSeleccionado?.ManualPDF"
                color="red-9"
                icon="picture_as_pdf"
                label="Descargar Manual PDF"
                class="full-width"
                @click="descargarPDF(procedimientoSeleccionado.ManualPDF)"
              />
            </div>
          </div>
        </q-card-section>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}

//para el dialog de procedimientos
import { ref, onMounted, watch, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth' // Importamos

const authStore = useAuthStore()
const $q = useQuasar()

const procedimientos = ref(false)

const procedimientoSeleccionado = ref(null)

const fechaInicioProx = ref('') // Desde (Próxima)
const fechaFinProx = ref('') // Hasta (Próxima)
const loading = ref(false)
const Form = ref(false) // Controla el diálogo de Agregar/Editar
const modoEdicion = ref(false) // Switch para saber si estamos editando o creando
const soloLectura = ref(false) // Controla si los inputs están bloqueados (para ver detalles)
const tabActual = ref('registro') // Controla la pestaña activa
const rowsHistorial = ref([]) // Se llenará al abrir el diálogo
const search = ref('')
const listaPatrones = ref([])
const rows = ref([])
const mediciones = ref([]) // Aquí se guardarán los puntos de la plantilla
const patronesSeleccionados = ref([])
const backdropFilter = 'blur(5px)'
const selectedGage = ref(null)
const filtroEstado = ref('Todos')

const rowsFiltradas = computed(() => {
  let lista = rows.value

  if (filtroEstado.value !== 'Todos') {
    lista = lista.filter((row) => {
      const dias = calcularDias(row.FechaProxima)
      let estadoFila = ''

      // Prioridad 1: ¿Es nuevo?
      if (row.EsNuevo === 1) {
        estadoFila = 'NUEVO'
      }
      // Prioridad 2: ¿Está rechazado por calidad?
      else if (row.EstatusPasa === 0) {
        estadoFila = 'RECHAZADO'
      }
      // Prioridad 3: ¿Ya se pasó la fecha? (Rojo)
      else if (dias !== null && dias <= 0) {
        estadoFila = 'VENCIDO'
      }
      // Prioridad 4: ¿Faltan 7 días o menos? (Amarillo)
      else if (dias !== null && dias <= 7) {
        estadoFila = 'PROXIMO A CALIBRAR'
      }
      // Prioridad 5: Está al día (Blanco)
      else {
        estadoFila = 'CALIBRADO'
      }

      return estadoFila === filtroEstado.value
    })
  }

  if (fechaInicioProx.value && fechaFinProx.value) {
    const inicio = new Date(fechaInicioProx.value.replace(/\//g, '-'))
    const fin = new Date(fechaFinProx.value.replace(/\//g, '-'))
    fin.setHours(23, 59, 59, 999)

    lista = lista.filter((row) => {
      // Validamos que exista la fecha y no sea una fecha nula de sistema (1969/1970)
      if (
        !row.FechaProxima ||
        row.FechaProxima.startsWith('1969') ||
        row.FechaProxima.startsWith('1970')
      ) {
        return false
      }

      const fechaFila = new Date(row.FechaProxima.replace(/\//g, '-'))
      return fechaFila >= inicio && fechaFila <= fin
    })
  }

  return lista
})

const formModel = ref({
  GageSerie: '',
  Descripcion: '',
  FolioCertificado: '',
  FechaCalibracion: '',
  Resultado: '',
  EstatusPasa: 1,
  CalibracionBy: '',
  fechaProxima: '',
  E_Pusados: [],
  Temperatura: '',
  Humedad: '',
})

watch(
  () => formModel.value.FechaCalibracion,
  (nuevaFecha) => {
    // Verificamos que tengamos fecha y que el gage seleccionado tenga su frecuencia
    if (nuevaFecha && selectedGage.value && selectedGage.value.FreqMeses) {
      // Creamos la fecha (Quasar usa YYYY/MM/DD, la convertimos a formato estándar)
      const fecha = new Date(nuevaFecha.replace(/\//g, '-'))

      // Si la fecha es válida, sumamos los meses
      if (!isNaN(fecha.getTime())) {
        fecha.setMonth(fecha.getMonth() + selectedGage.value.FreqMeses)

        // Guardamos el resultado de vuelta en el modelo
        formModel.value.fechaProxima = fecha.toISOString().split('T')[0].replace(/-/g, '/')
      }
    }
  },
)

watch([() => formModel.value.PuntoNominal, () => formModel.value.ValorLeido], () => {
  // Aseguramos que trabajamos con números, si es vacío usamos 0
  const nominal = parseFloat(formModel.value.PuntoNominal) || 0
  const leido = parseFloat(formModel.value.ValorLeido) || 0

  // Calculamos la diferencia
  const diff = leido - nominal
  formModel.value.Diferencia = diff.toFixed(4)

  // Opcional: Lógica automática para marcar Aprobado/Rechazado
  // Si la diferencia absoluta es mayor a la tolerancia, podrías sugerir el cambio de radio
})

const calcularDiferencia = (index) => {
  const item = mediciones.value[index]
  if (item.ValorLeido !== null && item.PuntoNominal !== null) {
    item.Diferencia = (item.ValorLeido - item.PuntoNominal).toFixed(4)
  }
}

const prepararNuevaCalibracion = async (gageId) => {
  try {
    const res = await api.get(`/api/preparar-calibracion/${gageId}`)

    // Si res.data existe, intentamos mapear puntos. Si no, array vacío.
    const puntosServidor = res.data?.puntos || []

    mediciones.value = puntosServidor.map((punto) => ({
      Categoria: punto.Categoria,
      PuntoNominal: punto.PuntoNominal,
      ToleranciaMin: punto.ToleranciaMin,
      ToleranciaMax: punto.ToleranciaMax,
      ValorLeido: null,
      Diferencia: 0,
    }))

    listaPatrones.value = res.data?.patrones || []
  } catch (error) {
    console.error('Error al preparar los datos:', error)
    mediciones.value = [] // Limpiamos para evitar basura en pantalla
  }
}

const seleccionarParaCalibrar = async (row) => {
  onReset()
  formModel.value.GagesId = row.GageId
  formModel.value.GageSerie = row.GageSerie
  formModel.value.Descripcion = row.Descripcion
  selectedGage.value = row

  await prepararNuevaCalibracion(row.GageId)

  // CARGAR HISTORIAL AL ABRIR
  tabActual.value = 'registro' // Resetear a la primera pestaña
  try {
    const res = await api.get(`/api/historial/${row.GageId}`)
    rowsHistorial.value = res.data
  } catch (error) {
    console.error('No se pudo cargar el historial', error)
  }

  Form.value = true
}
// Prepara el formulario con los datos de la fila seleccionada
const prepararEdicion = async (row) => {
  onReset()
  soloLectura.value = false
  modoEdicion.value = true
  selectedGage.value = row
  formModel.value = { ...row }

  if (row.CalibracionId) {
    try {
      const respDetalle = await api.get(`/api/calibracion/detalle/${row.CalibracionId}`)
      mediciones.value = respDetalle.data.map((d) => ({
        ...d,
        ValorLeido: d.ValorLeido,
        Diferencia: d.Diferencia || 0,
      }))

      // 3. Traer el historial de este Gage específico
      const respHistorial = await api.get(`/api/historial/${row.GageId}`)
      rowsHistorial.value = respHistorial.data // Debes tener un ref('rowsHistorial')
    } catch (error) {
      console.error('Error cargando detalles o historial:', error)
    }
  }

  await cargarHistorialGage(row.GageId)

  Form.value = true
}

const verDetalles = async (row) => {
  soloLectura.value = true
  selectedGage.value = row

  // Clonamos el objeto para no afectar la fila original
  const datosCargados = { ...row }

  // CLAVE: Si vienen patrones en texto, los separamos por la coma
  if (datosCargados.E_Pusados && typeof datosCargados.E_Pusados === 'string') {
    datosCargados.E_Pusados = datosCargados.E_Pusados.split(', ')
  } else if (!datosCargados.E_Pusados) {
    datosCargados.E_Pusados = [] // Si no hay nada, inicializar array vacío
  }

  formModel.value = datosCargados

  // Cargar mediciones (tabla hija)
  if (row.CalibracionId) {
    const res = await api.get(`/api/calibracion/detalle/${row.CalibracionId}`)
    mediciones.value = res.data
  }

  Form.value = true
}

const onReset = () => {
  formModel.value = {
    GageSerie: '',
    Descripcion: '',
    FolioCertificado: '',
    FechaCalibracion: '',
    Resultado: '',
    EstatusPasa: 1,
    CalibracionBy: '',
    fechaProxima: '',
    E_Pusados: [],
    Temperatura: '',
    Humedad: '',
  }
  mediciones.value = [] // <--- Limpiar la tabla de puntos
  patronesSeleccionados.value = []
}

const insertarCalibracion = async () => {
  try {
    $q.loading.show({ message: 'Registrando calibración...' })

    const patronesSeleccionados = Array.isArray(formModel.value.E_Pusados)
      ? formModel.value.E_Pusados.join(', ')
      : formModel.value.E_Pusados

    // Mapeo de campos para que coincidan con lo que espera tu server.js
    const payload = {
      ...formModel.value,
      E_Pusados: patronesSeleccionados, // Aquí ya va como texto
      Mediciones: mediciones.value, // La tabla de puntos
      FechaCalibracion: formModel.value.FechaCalibracion.replace(/\//g, '-'),
      FechaProxima: formModel.value.fechaProxima.replace(/\//g, '-'),
    }

    const res = await api.post('/api/registrar-calibracion', payload)

    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Registro exitoso y Gage actualizado' })
      Form.value = false
      obtenerCalibraciones() // Recargar la tabla principal
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al conectar con el servidor' })
  } finally {
    $q.loading.hide()
  }
}

const actualizarCalibracion = async () => {
  try {
    $q.loading.show({ message: 'Actualizando registro...' })

    const bodyEnvio = {
      ...formModel.value,
      Mediciones: mediciones.value,
    }

    // Cambiamos 'datos.CalibracionId' por 'formModel.value.CalibracionId'
    await api.put(`/api/actualizar-calibracion/${formModel.value.CalibracionId}`, bodyEnvio)

    Form.value = false
    obtenerCalibraciones()

    $q.notify({
      color: 'positive',
      icon: 'done',
      message: 'Se ha actualizado correctamente',
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Error al actualizar, revisa la consola',
    })
  } finally {
    $q.loading.hide()
  }
}

const onSubmit = () => {
  if (modoEdicion.value) {
    actualizarCalibracion()
  } else {
    insertarCalibracion()
  }
}

const columns = [
  { name: 'CalibracionId', label: '#', field: 'CalibracionId', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'GageSerie', label: 'GageID', field: 'GageSerie', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'Descripcion', label: 'Gage', field: 'Descripcion', align: 'left', sortable: true }, // Era 'Descripcion', no 'description'
  {
    name: 'CalibracionBy',
    label: 'Calibrado por:',
    field: 'CalibracionBy',
    align: 'center',
    sortable: true,
  }, // 'Act_Inact' es el campo de tu DB
  {
    name: 'FechaCalibracion',
    label: 'Calibrado en',
    field: 'FechaCalibracion',
    align: 'center',
    sortable: true,
  }, // 'Act_Inact' es el campo de tu DB
  {
    name: 'FechaProxima',
    label: 'Prox. Calibracion',
    field: 'FechaProxima',
    align: 'center',
    sortable: true,
  }, // 'Act_Inact' es el campo de tu DB
  { name: 'Calibracion', label: 'Estado', align: 'center' },
  { name: 'Procedimiento', label: 'Procedimiento', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' },
]

const columnsHistorial = [
  {
    name: 'FechaCalibracion',
    label: 'Fecha',
    field: 'FechaCalibracion',
    align: 'left',
    format: (val) => formatearFecha(val),
  },
  { name: 'FolioCertificado', label: 'Folio', field: 'FolioCertificado', align: 'left' },
  { name: 'NombreProce', label: 'Manual', field: 'NombreProce', align: 'left' },
  { name: 'EstatusPasa', label: 'Resultado', field: 'EstatusPasa', align: 'center' },
  { name: 'CalibracionBy', label: 'Técnico', field: 'CalibracionBy', align: 'left' },
]

const obtenerCalibraciones = async () => {
  loading.value = true
  try {
    const respuesta = await api.get('/api/calibracion')
    rows.value = respuesta.data
  } catch (error) {
    console.error('Error al cargar las calibraciones', error)
  } finally {
    loading.value = false
  }
}

const cargarHistorialGage = async (id) => {
  try {
    const res = await api.get(`/api/historial/${id}`)
    rowsHistorial.value = res.data
  } catch (error) {
    console.error('Error al cargar historial', error)
  }
}

const formatearFecha = (fechaString) => {
  if (
    !fechaString ||
    fechaString === '0000-00-00' ||
    fechaString.startsWith('1969') ||
    fechaString.startsWith('1970') ||
    fechaString === 'null'
  ) {
    return '-- : --'
  }

  const fecha = new Date(fechaString)
  if (isNaN(fecha)) return '-- : --'

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha)
}

const abrirProcedimiento = (row) => {
  // row trae toda la información de la tabla, incluyendo los campos del procedimiento
  procedimientoSeleccionado.value = row
  procedimientos.value = true
}

const calcularDias = (fecha) => {
  if (!fecha) return 999 // Si no hay fecha, no está vencido
  const hoy = new Date()
  const prox = new Date(fecha.replace(/\//g, '-'))
  return Math.ceil((prox - hoy) / (1000 * 60 * 60 * 24))
}

const obtenerClaseFila = (row) => {
  // 1. Si es nuevo, color azulito (clase 'fila-nueva')
  if (row.EsNuevo === 1) return 'fila-nueva'

  // 2. Si falló la última calibración
  if (row.EstatusPasa === 0) return 'fila-rechazada'

  // 3. Lógica de fechas para los que sí están activos
  const diff = calcularDias(row.FechaProxima)
  if (diff <= 0) return 'fila-vencida' // Rojo
  if (diff <= 7) return 'fila-proxima' // Amarillo
  return ''
}

onMounted(() => {
  obtenerCalibraciones()
})
</script>

<style scoped>
/* Rojo suave para equipos que fallaron */
.fila-rechazada {
  background-color: #ffcdd2 !important;
}

/* Rojo muy claro para equipos vencidos */
.fila-vencida {
  background-color: #ffebee !important;
}

/* Naranja preventivo para los que están por vencer (15 días) */
.fila-proxima {
  background-color: #fff3e0 !important;
}

/* Efecto hover para que no se pierda el foco al pasar el mouse */
.q-tr:hover {
  filter: brightness(0.95);
}
.fila-nueva {
  background-color: #e8eaf6 !important; /* Azul lavanda para equipo nuevo */
  border-left: 5px solid #3f51b5; /* Una línea para que resalte más */
}
</style>
