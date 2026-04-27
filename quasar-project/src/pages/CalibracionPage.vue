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
                :options="['Todos','NUEVO','CALIBRADO','PROXIMO A CALIBRAR','VENCIDO','RECHAZADO',]" label="Filtrar por Estado" dense outlined style="min-width: 170px"/>

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
                    v-if="authStore.usuario?.edit_gage && (props.row.EsNuevo === 1 || calcularDias(props.row.FechaProxima) <= 0)"
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
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="formModel.GageSerie" label="Gage ID" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="formModel.Descripcion" label="Equipo" readonly />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.FolioCertificado"
                  label="No. de Certificado / Folio"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.E_Pusados"
                  label="Patrón/Equipo Usado"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.Temperatura"
                  label="Temp (°C)"
                  type="number"
                  step="0.1"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.Humedad"
                  label="Humedad (%)"
                  type="number"
                  step="0.1"
                />
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.PuntoNominal"
                  type="number"
                  step="0.0001"
                  label="Punto Nominal"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.ValorLeido"
                  label="Valor Leído"
                  type="number"
                  step="0.0001"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  readonly
                  v-model="formModel.Diferencia"
                  label="Diferencia"
                  bg-color="grey-2"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.CalibracionBy"
                  label="Calibrado por"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  filled
                  :readonly="soloLectura"
                  v-model="formModel.FechaCalibracion"
                  mask="date"
                  label="Fecha Calibración"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy><q-date v-model="formModel.FechaCalibracion" /></q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-8 flex items-center justify-around">
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
    <q-card>
      <q-bar class="bg-primary text-white q-pa-lg">
        <div class="text-h6">{{ procedimientoSeleccionado?.NombreProce || 'NombreProce' }}</div>
        <q-space />
        <q-btn flat icon="close" v-close-popup>
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
const rows = ref([])
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
  E_Pusados: '',
  Temperatura: '',
  Humedad: '',
  PuntoNominal: '',
  ToleranciaMin: '',
  ToleranciaMax: '',
  ValorLeido: '',
  Diferencia: '',
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

const seleccionarParaCalibrar = async (row) => {
  onReset()
  formModel.value.GagesId = row.GageId
  formModel.value.GageSerie = row.GageSerie
  formModel.value.Descripcion = row.Descripcion
  selectedGage.value = row

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
  soloLectura.value = false // IMPORTANTE: Desbloquear para editar
  modoEdicion.value = true
  selectedGage.value = row
  formModel.value = { ...row }

  if (row.CalibracionId) {
    try {
      const respDetalle = await api.get(`/api/calibracion/detalle/${row.CalibracionId}`)
      if (respDetalle.data.length > 0) {
        // Mapeamos los campos del detalle al modelo del formulario
        const dtl = respDetalle.data[0] // Tomamos el primer registro de detalle
        formModel.value.PuntoNominal = dtl.PuntoNominal
        formModel.value.ToleranciaMin = dtl.ToleranciaMin
        formModel.value.ToleranciaMax = dtl.ToleranciaMax
        formModel.value.ValorLeido = dtl.ValorLeido
        formModel.value.Diferencia = dtl.Diferencia
      }

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
  soloLectura.value = true // Activamos el bloqueo de inputs
  modoEdicion.value = false
  selectedGage.value = row
  formModel.value = { ...row } // Pasamos los datos al formModel

  if (row.CalibracionId) {
    try {
      const respDetalle = await api.get(`/api/calibracion/detalle/${row.CalibracionId}`)
      if (respDetalle.data.length > 0) {
        const dtl = respDetalle.data[0]
        formModel.value.PuntoNominal = dtl.PuntoNominal
        formModel.value.ToleranciaMin = dtl.ToleranciaMin
        formModel.value.ToleranciaMax = dtl.ToleranciaMax
        formModel.value.ValorLeido = dtl.ValorLeido
        formModel.value.Diferencia = dtl.Diferencia
      }

      const respHistorial = await api.get(`/api/historial/${row.GageId}`)
      rowsHistorial.value = respHistorial.data
    } catch (error) {
      console.error('Error al ver detalles:', error)
    }
  }

  Form.value = true // Abrimos el diálogo
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
    E_Pusados: '',
    Temperatura: '',
    Humedad: '',
    PuntoNominal: '',
    ToleranciaMin: '',
    ToleranciaMax: '',
    ValorLeido: '',
    Diferencia: '',
  }
}

const insertarCalibracion = async () => {
  try {
    $q.loading.show({ message: 'Registrando calibración...' })

    // Mapeo de campos para que coincidan con lo que espera tu server.js
    const payload = {
      GagesId: formModel.value.GagesId,
      FechaCalibracion: formModel.value.FechaCalibracion.replace(/\//g, '-'),
      Resultado: formModel.value.Resultado, // Antes era valorMedido
      EstatusPasa: formModel.value.EstatusPasa,
      CalibracionBy: formModel.value.CalibracionBy, // Antes era calibradoPor
      FechaProxima: formModel.value.fechaProxima.replace(/\//g, '-'),
      CapturadoPor: 1,
      FolioCertificado: formModel.value.FolioCertificado, // Antes era folio
      E_Pusados: formModel.value.E_Pusados,
      Temperatura: formModel.value.Temperatura,
      Humedad: formModel.value.Humedad,
      PuntoNominal: formModel.value.PuntoNominal,
      ToleranciaMin: formModel.value.ToleranciaMin,
      ToleranciaMax: formModel.value.ToleranciaMax,
      ValorLeido: formModel.value.ValorLeido,
      Diferencia: formModel.value.Diferencia,
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

    const datos = formModel.value

    let fechaLimpia = datos.FechaCalibracion
    if (fechaLimpia && fechaLimpia.includes('T')) {
      fechaLimpia = fechaLimpia.split('T')[0] // Si viene con ISO Time, nos quedamos solo con la fecha
    }

    const bodyEnvio = {
      CalibracionId: datos.CalibracionId, // ID de la calibración
      GagesId: datos.GageId || datos.GagesId, // Aseguramos el ID del Gage
      FechaCalibracion: fechaLimpia,
      Resultado: datos.Resultado,
      EstatusPasa: datos.EstatusPasa,
      CalibracionBy: datos.CalibracionBy,
      FechaProxima: datos.fechaProxima,
      FolioCertificado: datos.FolioCertificado,
      E_Pusados: datos.E_Pusados,
      Temperatura: datos.Temperatura,
      Humedad: datos.Humedad,
      PuntoNominal: datos.PuntoNominal,
      ToleranciaMin: datos.ToleranciaMin,
      ToleranciaMax: datos.ToleranciaMax,
      ValorLeido: datos.ValorLeido,
      Diferencia: datos.Diferencia,
    }

    await api.put(`/api/actualizar-calibracion/${datos.CalibracionId}`, bodyEnvio)

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
