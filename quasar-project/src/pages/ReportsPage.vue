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
          <q-btn flat color="green-8" icon="description" label="EXPORTAR EXCEL" @click="exportarExcel">
            <q-tooltip>Exportar a Excel (.xlsx)</q-tooltip>
          </q-btn>
          <q-btn flat  color="red-8" icon="picture_as_pdf" label="EXPORTAR PDF" @click="descargarPDF">
            <q-tooltip>Exportar a PDF</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-card class="my-card shadow-1 shadow-up-1 q-mb-md">
        <q-card-section>
          <!-- FILA 1: Selectores superiores -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select v-model="opciones" :options="list" label="Seleccionar Tipo de Reporte" outlined dense />
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
                  
                </q-input>
              </div>
            </div>

            <!-- BOTONES -->
            <div class="row justify-end q-mt-sm q-gutter-sm">
              <q-btn v-if="opciones?.value === 'LabelStatus'" label="Imprimir Etiqueta" color="green-8" icon="print" unelevated @click="imprimirEtiquetaZD621"/>
              <q-btn label="Generar Reporte" type="submit" color="blue-8" icon="task_alt" unelevated />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="my-card shadow-1 shadow-up-1 q-mt-lg">
        <!-- VISTA POR DEFECTO: Cuando no hay reporte generado -->
        <q-card-section v-if="!pdfUrl" class="q-pa-lg text-center text-grey-7 bg-grey-1" style="min-height: 300px">
          <q-icon name="preview" size="5rem" class="q-mb-md" />
          <div class="text-h6">Área de Pre-visualización</div>
          <p>Una vez que generes el reporte, aparecerá aquí antes de imprimirlo o exportarlo.</p>
        </q-card-section>
        <q-card-section v-else class="q-pa-none flex column" style="height: 700px; overflow: hidden">
          <!-- Barra superior del visor -->
          <div class="row bg-grey-3 q-pa-sm justify-between items-center shadow-1" style="z-index: 10">
            <div class="text-subtitle2 text-grey-8 q-ml-sm">Vista Previa del Documento</div>
            <q-btn flat round color="negative" icon="close" size="sm" @click="pdfUrl = null">
              <q-tooltip>Cerrar vista previa</q-tooltip>
            </q-btn>
          </div>

          <!-- Contenedor del Visor con Flex-Grow -->
          <div class="col full-width">
            <iframe :src="pdfUrl" width="100%" height="100%" style="border: none; display: block"></iframe>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { api } from 'boot/axios'

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
const datosAImprimir = ref([])
// Lista de reportes
const list = [
  { label: 'Etiqueta de Estado de Calibración', value: 'LabelStatus' },
  { label: 'Calibraciones (General)', value: 'General' },
  { label: 'Calibraciones Sin Calibrar', value: 'SinCalibrar' },
  { label: 'Calibraciones Pendientes', value: 'Pendientes' },
  { label: 'Calibraciones Próximas a Vencer', value: 'Proximos' },
  { label: 'Historial de Calibraciones', value: 'Historial' },
  { label: 'Procedimientos', value: 'Procedimiento' },
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
    const response = await api.get('/api/calibracion')
    let datosBd = response.data
  
    // --- 1. FILTRADO POR FECHAS (Si el usuario las seleccionó) ---
    if (fechaInicio.value && fechaFin.value) {
      const inicio = new Date(fechaInicio.value)
      const fin = new Date(fechaFin.value)
      datosBd = datosBd.filter((item) => {
        const fechaItem = new Date(item.FechaCalibracion)
        return fechaItem >= inicio && fechaItem <= fin
      })
    }

    // NUEVO: Filtro por GageID (Afecta a todos los reportes)
    if (gageId.value) {
      const busqueda = gageId.value.toLowerCase()
      datosBd = datosBd.filter((item) => 
        (item.GageSerie?.toLowerCase().includes(busqueda)) || (item.Descripcion?.toLowerCase().includes(busqueda)))
    }

    datosAImprimir.value = datosBd;

    let columnas = []
    let filas = []
    let tituloReporte = opciones.value.label

    // --- 2. MAPEO DINÁMICO SEGÚN EL REPORTE ---
    switch (opciones.value.value) {
      case 'General': {
        columnas = [['Gage NID', 'Descripción', 'Estatus', 'Fecha de Cal.','calibración']]
        filas = datosBd.map((item) => [
          item.GageSerie || 'N/A',
          item.Descripcion || 'N/A',
          item.EstatusPasa === 1 ? 'Aprobado' : 'No Aprobado',
          item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'Sin Calibrar',
          item.FechaCalibracion === null ? 'Nuevo' : 'Calibrado',
        ])
        break
      }
      case 'SinCalibrar': {
        columnas = [['Gage NID', 'Descripción', 'Estatus']]
        filas = datosBd
          .filter((item) => item.FechaCalibracion === null) // Solo sin calibrar
          .map((item) => [
            item.GageSerie || 'N/A',
            item.Descripcion || 'N/A',
            item.FechaCalibracion === null ? 'Nuevo' : 'Calibrado',
          ])
        break
      }
      case 'Pendientes': {
        columnas = [
          ['Gage NID', 'Descripción', 'Fecha de calibración', 'Fecha próxima', 'Días vencidos'],
        ]
        filas = datosBd
          .filter((item) => {
            const dias = calcularDias(item.FechaProxima)
            return dias <= 0 && dias > -30
          }) // Solo pendientes de calibrar
          .map((item) => [
            item.GageSerie || 'N/A',
            item.Descripcion || 'N/A',
            item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
            item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
            `${calcularDias(item.FechaProxima)} días`,
          ])
        break
      }
      case 'Proximos': {
        columnas = [
          ['Gage NID', 'Descripción', 'Fecha de calibración', 'Fecha próxima', 'Días para vencer'],
        ]
        filas = datosBd
          .filter((item) => {
            const dias = calcularDias(item.FechaProxima)
            return dias > 0 && dias <= 7 // Vencen en la próxima semana
          }) // Solo Proximos a vencer
          .map((item) => [
            item.GageSerie || 'N/A',
            item.Descripcion || 'N/A',
            item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A',
            item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A',
            `${calcularDias(item.FechaProxima)} días`,
          ])
        break
      }

      case 'LabelStatus': {
        
        filas = [];
        datosBd.forEach((item, index) => {
          // 1. Extraer y formatear fechas
          const fechaUltima = item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A';
          const fechaProxima = item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A';
          const tecnico = item.Tecnico || item.CalibracionBy || 'N/A';

          // 2. FILA DE ENCABEZADO (Verde con ID y Técnico)
          filas.push([
            { 
              content: `ID: ${item.GageSerie || 'N/A'}`, 
              styles: { fillColor: [0, 155, 74], textColor: [255, 255, 255], fontStyle: 'bold' } 
            },
            { 
              content: `By: ${tecnico}`, 
              styles: { fillColor: [0, 155, 74], textColor: [255, 255, 255], fontStyle: 'bold' } 
            }
          ]);

          // 3. FILA DE DATOS (Gris con fechas)
          // IMPORTANTE: Cada celda debe ser un objeto si quieres estilos individuales
          filas.push([
            { 
              content: `Last: ${fechaUltima}`, 
              styles: { fillColor: [245, 245, 245], textColor: [40, 40, 40] } 
            },
            { 
              content: `Next: ${fechaProxima}`, 
              styles: { fillColor: [245, 245, 245], textColor: [40, 40, 40] } 
            }
          ]);

          // 4. ESPACIADOR (Fila vacía blanca)
          if (index < datosBd.length - 1) {
            filas.push([
              { content: '', colSpan: 2, styles: { minCellHeight: 5, fillColor: [255, 255, 255] } }
            ]);
          }
        });
        break;
      }

      case 'Historial': {
        // Filtrado por GageID si se proporcionó en el input

        columnas = [['Gage NID', 'Fecha', 'Certificado', 'Realizado por', 'Resultado']]
        filas = datosBd.map((item) => [
          item.GageSerie,
          item.FechaCalibracion
            ? new Date(item.FechaCalibracion).toLocaleDateString()
            : 'Sin Calibrar',
          item.FolioCertificado || 'N/A',
          item.CalibracionBy || 'Sin Calibrar',
          item.EstatusPasa === 1 ? 'PASA' : 'FALLA',
        ])
        break
      }

      case 'Procedimiento': {
        columnas = [['Procedimiento', 'Gage NID', 'Descripción']]
        filas = datosBd.map((item) => [
          item.NombreProce || 'N/A',
          item.GageSerie || 'N/A',
          item.Descripcion || 'N/A',
        ])
        break
      }

      default: {
        columnas = [['Gage ID', 'Descripción', 'Estatus']]
        filas = datosBd.map((item) => [
          item.GageSerie,
          item.Descripcion,
          item.EstatusPasa === 1 ? 'OK' : 'PENDIENTE',
        ])
      }
    }

    // --- 3. GENERACIÓN DEL PDF ---
    const doc = new jsPDF()

    // Encabezado estético
    doc.setFillColor(0, 155, 74) // Azul Nidec
    doc.rect(0, 0, 210, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text('NIDEC Q-GAGE - SISTEMA DE CONTROL DE GAGES', 14, 10)

    doc.setTextColor(40, 40, 40)
    doc.setFontSize(18)
    doc.text(tituloReporte, 14, 30)

    autoTable(doc, {
      startY: 35,
      head: columnas,
      body: filas,
      theme: 'striped',
      headStyles: { fillColor: [0, 155, 74] },
      styles: { fontSize: 9 },
    })

    pdfUrl.value = doc.output('bloburl')
  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      color: 'negative',
      message: 'Error al procesar datos para el reporte.',
    })
  }
}

const calcularDias = (fecha) => {
  if (!fecha) return 999 // Si no hay fecha, no está vencido
  const hoy = new Date()
  const prox = new Date(fecha.replace(/\//g, '-'))
  return Math.ceil((prox - hoy) / (1000 * 60 * 60 * 24))
}

const descargarPDF = () => {
  if (!opciones.value) {
    $q.notify({ message: 'Selecciona un reporte primero', color: 'warning' })
    return
  }

  // Preparamos los filtros para que el servidor sepa qué data poner en el PDF
 
  const params = new URLSearchParams({
    tipo: opciones.value.value,
    search: gageId.value || '' // Usamos gageId que es tu ref de búsqueda
  }).toString();

  window.open(`${api.defaults.baseURL}/api/reportes/pdf?${params}`, '_blank');
};

const exportarExcel = () => {
  if (!opciones.value) {
    $q.notify({ message: 'Selecciona un reporte primero', color: 'warning' })
    return
  }

  // Enviamos TODO: tipo, búsqueda, y las fechas de los calendarios
  const params = new URLSearchParams({
    tipo: opciones.value.value,
    search: gageId.value || '',
    inicio: fechaInicio.value || '', // Tus refs de la página
    fin: fechaFin.value || ''
  }).toString();

  window.open(`${api.defaults.baseURL}/api/reportes/excel?${params}`, '_blank');
}

const imprimirEtiquetaZD621 = () => {
  if (!window.BrowserPrint) {
    $q.notify({ message: 'Zebra Browser Print no está iniciado', color: 'warning' });
    return;
  }

  // Validamos que el usuario haya generado el reporte primero
  if (!datosAImprimir.value || datosAImprimir.value.length === 0) {
    $q.notify({ message: 'Primero genera el reporte para cargar los datos.', color: 'warning' });
    return;
  }

  // Vamos a crear un solo string gigante con todo el código ZPL
  let zplLote = '';

  datosAImprimir.value.forEach(item => {
    const nidGage = item.GageSerie || 'N/A';
    const tecnico = item.Tecnico || item.CalibracionBy || 'N/A';
    const fechaUltima = item.FechaCalibracion ? new Date(item.FechaCalibracion).toLocaleDateString() : 'N/A';
    const fechaProxima = item.FechaProxima ? new Date(item.FechaProxima).toLocaleDateString() : 'N/A';

    // Agregamos la etiqueta actual al lote (Usando tu diseño exacto)
    zplLote += `
      ^XA
      ^CF0,20
      ^FO20,35^FDID:^FS^FO70,35^FD${nidGage}^FS
      ^FO220,35^FDBy:^FS^FO270,35^FD${tecnico}^FS
      ^FO20,75^FDLast:^FS^FO90,75^FD${fechaUltima}^FS
      ^FO220,75^FDNext:^FS^FO285,75^FD${fechaProxima}^FS
      ^XZ
    `;
  });

  // Enviamos todo el lote de golpe a la impresora
  window.BrowserPrint.getDefaultDevice("printer", (device) => {
    if (device) {
      $q.notify({ message: `Enviando ${datosAImprimir.value.length} etiquetas a la ZD621...`, color: 'positive', icon: 'print' });
      
      device.send(zplLote, undefined, (error) => {
        console.error('Error de Zebra:', error);
        $q.notify({ message: 'Error de comunicación con la Zebra', color: 'negative' });
      });
    }
  });
};
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
