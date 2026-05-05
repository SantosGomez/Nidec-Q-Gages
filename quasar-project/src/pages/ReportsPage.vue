<template>
  <q-page class="bg-grey-2 q-pa-lg">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      <div class="row items-center q-mb-lg">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Módulo de Reportes</div>
        <q-space />
        <!-- Esto empuja las exportaciones a la derecha -->

        <!-- Marcadores de posición para exportaciones (futura funcionalidad) -->
        <div class="q-gutter-sm">
          <q-btn flat round color="green-8" icon="description">
            <q-tooltip>Exportar a Excel (.xlsx)</q-tooltip>
          </q-btn>
          <q-btn flat round color="red-8" icon="picture_as_pdf">
            <q-tooltip>Exportar a PDF</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-card class="my-card shadow-1 shadow-up-1 q-mb-md">
        <q-card-section>
          <!-- FILA 1: Selectores superiores -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="opciones"
                :options="list"
                label="Seleccionar Tipo de Reporte"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-banner rounded class="bg-blue-1 text-blue-9 q-pa-sm" dense bordered>
                <template v-slot:avatar><q-icon name="help" color="blue-9" /></template>
                <div class="text-caption">
                  <span class="text-weight-bold">Guía:</span> Dejar campos vacíos para incluir todo.
                </div>
              </q-banner>
            </div>
          </div>

          <!-- SEPARADOR FUERA DEL ROW (Ahora sí será una línea delgada) -->
          <q-separator class="q-my-md" color="grey-4" style="height: 1px" />

          <!-- FILA 2: Formulario de parámetros -->
          <q-form @submit="onSubmit">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input outlined v-model="fechaInicio" mask="date" label="Fecha de Inicio" dense>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fechaInicio">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Aceptar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input outlined v-model="fechaFin" mask="date" label="Fecha de Fin" dense>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fechaFin">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Aceptar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined v-model="gageId" label="Filtrar por GageID (NID)" dense>
                  <template v-slot:append>
                    <q-icon name="precision_manufacturing" color="blue-grey-4" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- BOTONES -->
            <div class="row justify-end q-mt-sm q-gutter-sm">
              <q-btn
                v-if="gageId"
                label="Imprimir Etiqueta"
                color="green-8"
                icon="print"
                unelevated
              />
              <q-btn
                label="Generar Reporte"
                type="submit"
                color="blue-8"
                icon="task_alt"
                unelevated
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="my-card shadow-1 shadow-up-1 q-mt-lg">
        <!-- VISTA POR DEFECTO: Cuando no hay reporte generado -->
        <q-card-section
          v-if="!pdfUrl"
          class="q-pa-lg text-center text-grey-7 bg-grey-1"
          style="min-height: 300px"
        >
          <q-icon name="preview" size="5rem" class="q-mb-md" />
          <div class="text-h6">Área de Pre-visualización</div>
          <p>Una vez que generes el reporte, aparecerá aquí antes de imprimirlo o exportarlo.</p>
        </q-card-section>
        <q-card-section
          v-else
          class="q-pa-none flex column"
          style="height: 700px; overflow: hidden"
        >
          <!-- Barra superior del visor -->
          <div
            class="row bg-grey-3 q-pa-sm justify-between items-center shadow-1"
            style="z-index: 10"
          >
            <div class="text-subtitle2 text-grey-8 q-ml-sm">Vista Previa del Documento</div>
            <q-btn flat round color="negative" icon="close" size="sm" @click="pdfUrl = null">
              <q-tooltip>Cerrar vista previa</q-tooltip>
            </q-btn>
          </div>

          <!-- Contenedor del Visor con Flex-Grow -->
          <div class="col full-width">
            <iframe
              :src="pdfUrl"
              width="100%"
              height="100%"
              style="border: none; display: block"
            ></iframe>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

function index() {
  router.push('/')
}

// Variables para parámetros
const opciones = ref(null)
const fechaInicio = ref('')
const fechaFin = ref('')
const gageId = ref('')
const pdfUrl = ref(null)

// Lista de reportes
const list = [
  { label: 'Etiqueta de Estado de Calibración', value: 'LabelStatus' },
  { label: 'Calibraciones Pendientes (General)', value: 'Pendientes' },
  { label: 'Calibraciones Pendientes con Procedimiento', value: 'PendientesConProcedimiento' },
  { label: 'Calibraciones Pendientes con Estándares', value: 'PendientesConEstandares' },
  { label: 'Calibraciones Pendientes por Mes', value: 'PendientesPorMes' },
  { label: 'Historial de Calibraciones', value: 'Historial' },
]

// SOLUCIÓN AL WARNING: Definimos onSubmit para el q-form
const onSubmit = () => {
  // Cuando el usuario da clic en "Generar Reporte" (type="submit")
  generarPrevisualizacion()
}

const generarPrevisualizacion = async () => {
  if (!opciones.value) {
    $q.notify({
      color: 'warning',
      textColor: 'dark',
      icon: 'warning',
      message: 'Por favor, selecciona un Tipo de Reporte.',
    })
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/calibracion')
    if (!response.ok) throw new Error('Fallo al conectar con el servidor')

    let datosBd = await response.json()

    // --- 1. FILTRADO POR FECHAS (Si el usuario las seleccionó) ---
    if (fechaInicio.value && fechaFin.value) {
      const inicio = new Date(fechaInicio.value)
      const fin = new Date(fechaFin.value)
      
      datosBd = datosBd.filter(item => {
        const fechaItem = new Date(item.FechaCalibracion)
        return fechaItem >= inicio && fechaItem <= fin
      })
    }

    let columnas = []
    let filas = []
    let tituloReporte = opciones.value.label

    // --- 2. MAPEO DINÁMICO SEGÚN EL REPORTE ---
    switch (opciones.value.value) {
      case 'Pendientes':
      case 'PendientesPorMes': {
        columnas = [['NID (Serie)', 'Descripción', 'Frecuencia', 'Próxima Calib.']]
        filas = datosBd.map((item) => [
          item.GageSerie || 'N/A',
          item.Descripcion || 'N/A',
          item.NomFreq || 'N/A',
          item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'Vencido'
        ])
        break
      }

      case 'PendientesConProcedimiento': {
        columnas = [['NID', 'Procedimiento', 'Tolerancia', 'Instrucción']]
        filas = datosBd.map((item) => [
          item.GageSerie || 'N/A',
          item.NombreProce || 'Sin Manual',
          item.Tolerancia || 'N/A',
          item.Instrucciones ? item.Instrucciones.substring(0, 50) + '...' : 'Ver manual'
        ])
        break
      }

      case 'LabelStatus': {
        columnas = [['Propiedad', 'Valor']]
        // Si hay un GageId filtrado, buscamos ese, si no, el primero de la lista
        const itemParaEtiqueta = gageId.value 
          ? datosBd.find(i => i.GageSerie === gageId.value) || {} 
          : datosBd[0] || {}

        filas = [
          ['Gage NID', itemParaEtiqueta.GageSerie || 'N/A'],
          ['Resultado', itemParaEtiqueta.EstatusPasa === 1 ? 'PASA' : 'FALLA'],
          ['Fecha Calib.', itemParaEtiqueta.FechaCalibracion ? new Date(itemParaEtiqueta.FechaCalibracion).toLocaleDateString() : 'N/A'],
          ['Vence', itemParaEtiqueta.FechaProxima ? new Date(itemParaEtiqueta.FechaProxima).toLocaleDateString() : 'N/A'],
          ['Certificado', itemParaEtiqueta.FolioCertificado || 'N/A']
        ]
        break
      }

      case 'Historial': {
        // Filtrado por GageID si se proporcionó en el input
        if (gageId.value) {
          datosBd = datosBd.filter((item) => item.GageSerie === gageId.value)
        }
        columnas = [['Gage NID','Fecha', 'Certificado', 'Realizado por', 'Resultado']]
        filas = datosBd.map((item) => [
          item.GageSerie || 'N/A',
          item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
          item.FolioCertificado || 'N/A',
          item.CalibracionBy || 'Sistema',
          item.EstatusPasa === 1 ? 'PASA' : 'FALLA'
        ])
        break
      }

      default: {
        columnas = [['Gage ID', 'Descripción', 'Estatus']]
        filas = datosBd.map((item) => [
          item.GageSerie, 
          item.Descripcion, 
          item.EstatusPasa === 1 ? 'OK' : 'PENDIENTE'
        ])
      }
    }

    // --- 3. GENERACIÓN DEL PDF ---
    const doc = new jsPDF()
    
    // Encabezado estético
    doc.setFillColor(0, 91, 170) // Azul Nidec
    doc.rect(0, 0, 210, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text("NIDEC Q-GAGE - SISTEMA DE CONTROL DE GAGES", 14, 10)

    doc.setTextColor(40, 40, 40)
    doc.setFontSize(18)
    doc.text(tituloReporte, 14, 30)

    autoTable(doc, {
      startY: 35,
      head: columnas,
      body: filas,
      theme: 'striped',
      headStyles: { fillColor: [0, 91, 170] },
      styles: { fontSize: 9 }
    })

    pdfUrl.value = doc.output('bloburl')

  } catch (error) {
    console.error('Error:', error)
    $q.notify({ 
      color: 'negative', 
      message: 'Error al procesar datos para el reporte.' 
    })
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.markup-sticky {
  max-height: 165px;
  overflow: auto;
}
</style>
