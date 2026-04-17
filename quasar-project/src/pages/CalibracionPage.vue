<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h3 flex flex-center" style="font-weight: bold">Calibracion De Gages</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <div class="col-12 col-md-12">
      <q-card class="my-card" style="max-width: 1250px; margin: 0 auto; margin-top: 20px">
        <q-card-section>
          <div class="text-h5">
            Bienvenido al sistema de calibración de Gages. Seleccione una opción.
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md text-right">
            <div class="col-12 col-md-3">
              <q-btn
                icon="add"
                style="
                  font-size: 18px;
                  width: 300px;
                  height: 40px;
                  margin-top: 5px;
                  margin-right: 10px;
                "
                color="primary"
                label="Calibrar Nuevo Gage"
                @click="abrirFormulario()"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-btn
                color="info"
                icon="list_alt"
                label="procedimientos"
                @click="procedimientos = true"
                style="
                  font-size: 18px;
                  width: 300px;
                  height: 40px;
                  margin-top: 5px;
                  margin-right: 10px;
                "
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-12">
      <q-card class="my-card" style="max-width: 1250px; margin: 0 auto">
        <q-card-section>
          <div class="text-h6">Calibraciones</div>
        </q-card-section>
        <q-card-section>
          <!--Tabla con la informacion de las calibraciones de los gages-->
          <q-table :rows="rows" :columns="columns" :filter="search" row-key="idGage" flat bordered>
            <template v-slot:top-right>
              <q-input v-model="search" dense debounce="300" placeholder="Buscar Gage">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-FechaCalibracion="props">
          <q-td :props="props">
            {{ formatearFecha(props.value) }}
          </q-td>
        </template>
        <template v-slot:body-cell-FechaProxima="props">
          <q-td :props="props">
            {{ formatearFecha(props.value) }}
          </q-td>
        </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  outline
                  round
                  color="warning"
                  icon="edit"
                  @click="prepararEdicion(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn outline round color="info" icon="visibility" @click="verDetalles(props.row)">
                  <q-tooltip>Ver Detalles</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- dialog de formulario para calibracion de gages -->
  <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
    <q-card class="my-card" style="max-width: 1000px; width: 100%; height: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h4">{{ modoEdicion ? 'Editar calibracion' : 'Nueva Calibracion' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input filled v-model="formModel.GageSerie" label="Gage ID" readonly />
            </div>
            <div class="col-12 col-md-6">
              <q-input filled v-model="formModel.Descripcion" label="Equipo" readonly />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="secondary"
                flat
                size="12px"
                icon="search"
                label="Seleccionar Gage"
                @click="abrirGages"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input filled :readonly="soloLectura" v-model="formModel.FolioCertificado" label="No. de Certificado / Folio" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.CalibracionBy"
                label="Calibrado por (Externo/Técnico)"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.FechaCalibracion"
                mask="date"
                label="Fecha de Calibración"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy><q-date v-model="formModel.FechaCalibracion" /></q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.Resultado"
                label="Valor Medido"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="q-gutter-sm">
                <q-radio
                  v-model="formModel.estatusPasa"
                  :val="1"
                  label="APROBADO"
                  color="positive"
                  :readonly="soloLectura"
                  keep-color
                />
                <q-radio
                  v-model="formModel.estatusPasa"
                  :val="0"
                  label="RECHAZADO"
                  color="negative"
                  :readonly="soloLectura"
                  keep-color
                />
              </div>
            </div>
          </div>
          <div class="col-12 q-mt-lg">
            <q-btn
              v-if="!soloLectura"
              :label="modoEdicion ? 'Guardar Cambios' : 'Registrar'"
              type="submit"
              color="primary"
            />
            <q-btn
              :label="soloLectura ? 'Cerrar' : 'CANCELAR'"
              flat
              color="negative"
              v-close-popup
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- dialog de procedimientos de calibracion -->
  <q-dialog v-model="procedimientos">
    <q-card style="max-width: 900px; width: 100%">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title> Procedimientos de Calibración </q-toolbar-title>

        <q-space />

        <q-input dark dense standout v-model="text" input-class="text-right" class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon v-else name="search" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>
      </q-toolbar>
      <q-card-section class="row items-center">
        <q-intersection :key="index" transition="scale" class="example-item">
          <div>
            <!-- seccion donde se pondra los procedimientos existentes -->
            <q-card class="my-card cursor-pointer q-hoverable" @click="openManual('motor')">
              <span class="q-focus-helper"></span>
              <q-card-section class="text-center bg-primary text-white">
                <q-icon name="settings_input_component" size="4rem" />
                <div class="text-h6">Motor / Rotor-SHAFT</div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat color="primary" label="Ver Procedimiento" />
              </q-card-actions>
            </q-card>
          </div>
        </q-intersection>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  // ---- Dialog para seleccionar un Gage
  <q-dialog
    v-model="Gages"
    persistent
    transition-show="scale"
    transition-hide="scale"
    :backdrop-filter="backdropFilter"
  >
    <q-layout
      view="hHh lpR fFf"
      container
      class="bg-white text-dark"
      style="height: 600px; width: 700px; max-width: 90vw"
    >
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Gages Sin Calibrar</q-toolbar-title>

          <q-input
            v-model="search"
            dark
            dense
            standout
            debounce="300"
            placeholder="Buscar por Serie o Descripción..."
            class="q-ml-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn style="margin-left: 10px" flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <div class="text-subtitle2 q-mb-md text-grey-8">
            Equipos nuevos detectados en el sistema:
          </div>

          <q-list bordered separator>
            <q-item
              v-for="gage in filteredGages"
              :key="gage.GageId"
              :loading="loading"
              clickable
              v-ripple
              @click="seleccionarGage(gage)"
            >
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ gage.GageSerie }}</q-item-label>
                <q-item-label caption>{{ gage.Descripcion }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-badge outline color="primary" :label="gage.Tipo" />
                <div class="text-caption text-grey-6">{{ formatearFecha(gage.FechaAlta) }}</div>
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-if="filteredGages.length === 0"
            class="column items-center q-pa-xl text-grey-4 text-center"
          >
            <q-icon name="manage_search" size="5rem" />
            <div class="text-h6">No coinciden resultados</div>
            <div class="text-caption">Intenta con otro ID o Serie</div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}

//para el dialog de procedimientos
import { ref, computed, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const procedimientos = ref(false)

const Gages = ref(false)
const loading = ref(false)
const Form = ref(false) // Controla el diálogo de Agregar/Editar
const modoEdicion = ref(false) // Switch para saber si estamos editando o creando
const soloLectura = ref(false) // Controla si los inputs están bloqueados (para ver detalles)
const text = ref('')
const search = ref('')
const listaGagesNuevos = ref([])
const rows = ref([])
const backdropFilter = 'blur(5px)'
const selectedGage = ref(null);

const formModel = ref({
  GageSerie: '',
  Descripcion: '',
  FolioCertificado: '',
  FechaCalibracion: '',
  Resultado: '',
  estatusPasa: 1,
  CalibracionBy: '',
  fechaProxima: ''
})

watch(() => formModel.value.FechaCalibracion, (nuevaFecha) => {
  if (nuevaFecha && selectedGage.value) {
    const fecha = new Date(nuevaFecha);
    // Sumamos los meses según la frecuencia del gage seleccionado
    fecha.setMonth(fecha.getMonth() + selectedGage.value.FreqMeses); 
    formModel.value.fechaProxima = fecha.toISOString().split('T')[0].replace(/-/g, '/');
  }
});

const cargarGagesNuevos = async () => {
  loading.value = true
  try {
    const respuesta = await api.get('/api/calibracion/nuevos')
    listaGagesNuevos.value = respuesta.data
  } catch (error) {
    console.error('Error al traer gages:', error)
  } finally {
    loading.value = false
  }
}

const abrirGages = () => {
  Gages.value = true
}

const filteredGages = computed(() => {
  if (!search.value) return listaGagesNuevos.value

  const termo = search.value.toLowerCase()
  return listaGagesNuevos.value.filter(
    (g) => g.GageSerie.toLowerCase().includes(termo) || g.Descripcion.toLowerCase().includes(termo),
  )
})

const seleccionarGage = (gage) => {
  selectedGage.value = gage; // Guardamos el objeto completo para tener la frecuencia
  formModel.value.GagesId = gage.GageId; // ID numérico para la DB
  formModel.value.GageSerie = gage.GageSerie; // Serie para mostrar al usuario
  formModel.value.Descripcion = gage.Descripcion;
  Gages.value = false;
}



const abrirFormulario = () => {
  soloLectura.value = false // IMPORTANTE: Desbloquear para nuevos registros
  modoEdicion.value = false
  onReset()
  Form.value = true
}

// Prepara el formulario con los datos de la fila seleccionada
const prepararEdicion = (row) => {
  soloLectura.value = false // IMPORTANTE: Desbloquear para editar
  modoEdicion.value = true
  formModel.value = { ...row }
  Form.value = true
}

const verDetalles = (row) => {
  soloLectura.value = true // Activamos el bloqueo de inputs
  modoEdicion.value = false
  formModel.value = { ...row } // Pasamos los datos al formModel
  Form.value = true // Abrimos el diálogo
}

const onReset = () => {
  formModel.value = {
    GageSerie: '',
    Descripcion: '',
    FolioCertificado: '',
    FechaCalibracion: '',
    Resultado: '',
    estatusPasa: 1,
    CalibracionBy: '',
    fechaProxima: ''
  }
}

const onSubmit = async () => {
  try {
    $q.loading.show({ message: 'Registrando calibración...' });
    
    // Mapeo de campos para que coincidan con lo que espera tu server.js
    const payload = {
      GagesId: formModel.value.GagesId,
      FechaCalibracion: formModel.value.FechaCalibracion,
      Resultado: formModel.value.Resultado, // Antes era valorMedido
      EstatusPasa: formModel.value.estatusPasa,
      CalibracionBy: formModel.value.CalibracionBy, // Antes era calibradoPor
      FechaProxima: formModel.value.fechaProxima,
      CapturadoPor: 1, 
      FolioCertificado: formModel.value.FolioCertificado // Antes era folio
    };

    const res = await api.post('/api/registrar-calibracion', payload);

    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Registro exitoso y Gage actualizado' });
      Form.value = false;
      obtenerCalibraciones(); // Recargar la tabla principal
      cargarGagesNuevos();    // Limpiar la lista de pendientes
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Error al conectar con el servidor' });
  } finally {
    $q.loading.hide();
  }
}
const columns = [
  { name: 'CalibracionId', label: '#', field: 'CalibracionId', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'GageSerie', label: 'GageID', field: 'GageSerie', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'Descripcion', label: 'Gage', field: 'Descripcion', align: 'left', sortable: true }, // Era 'Descripcion', no 'description'
  { name: 'CalibracionBy', label: 'Calibrado por:', field: 'CalibracionBy', align: 'center', sortable: true}, // 'Act_Inact' es el campo de tu DB
  { name: 'FechaCalibracion', label: 'Calibrado en', field: 'FechaCalibracion', align: 'center', sortable: true}, // 'Act_Inact' es el campo de tu DB
  { name: 'FechaProxima', label: 'Prox. Calibracion', field: 'FechaProxima', align: 'center', sortable: true}, // 'Act_Inact' es el campo de tu DB
  { name: 'actions', label: 'Acciones', align: 'center' },
]

const obtenerCalibraciones = async () => {
  loading.value = true
  try {
    const respuesta = await api.get('/api/calibracion')
    rows.value = respuesta.data
  } catch (error) {
    console.error('Error al cargar las calibraciones', error)
  } finally{
    loading.value = false
  }
}

const formatearFecha = (fechaString) => {

  const fecha = new Date(fechaString)
  if (isNaN(fecha)) return fechaString

  // Usamos 'en-GB' o 'es-MX' con hour12: false para forzar las 24h
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha)
}


onMounted(() => {
  cargarGagesNuevos()
  obtenerCalibraciones()
})
</script>
