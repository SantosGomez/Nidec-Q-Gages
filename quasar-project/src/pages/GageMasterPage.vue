<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h2 flex flex-center" style="font-weight: bold">Gages</div>

  <div class="row q-col-gutter-md q-px-md flex flex-center" style="margin-top: 20px">
    <q-card class="my-card full-width" style="max-width: 1250px; margin: 0 auto">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h5">Gestion de Gages</div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <q-btn
              icon="add"
              color="primary"
              label="Agregar Gage"
              @click="abrirFormulario"
              class="q-px-lg"
              size="large"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="gagesFiltrados"
          :columns="columns"
          :loading="loading"
          row-key="GageId"
          flat
          bordered
        >
          <template v-slot:top-right>
            <q-input
              v-model="search"
              dense
              filled
              debounce="300"
              placeholder="Buscar por ID o Nombre"
              style="width: 300px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

         <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-btn 
                :color="props.row.Act_Inact == 1 ? 'positive' : 'grey-7'" 
                :icon="props.row.Act_Inact == 1 ? 'check_circle' : 'cancel'" 
                :label="props.row.Act_Inact == 1 ? 'Activo' : 'Inactivo'"
                size="sm"
                unelevated
                @click="confirmarInactivar(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn
                outline
                round
                color="warning"
                icon="edit"
                size="sm"
                @click="prepararEdicion(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                outline
                round
                color="info"
                icon="visibility"
                size="sm"
                @click="verDetalles(props.row)"
              >
                <q-tooltip>Ver ficha técnica</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-8 q-gutter-sm">
              <q-icon size="2em" name="sentiment_dissatisfied" />
              <span>No se encontraron gages que coincidan con "{{ search }}"</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="bg-primary text-white">
        <div class="text-h4">{{ modoEdicion ? 'Editar Gage' : 'Nuevo Gage' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input filled :readonly="soloLectura" v-model="formModel.GageSerie" label="Gage Serie" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.Descripcion"
                label="Nombre del Gage"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                :readonly="soloLectura"
                v-model="formModel.Tipo"
                :options="opcionesTipo"
                label="Tipo"
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                :readonly="soloLectura"
                v-model="formModel.Estado"
                :options="opcionesEstado"
                label="Estado"
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.Locacion"
                label="Localización"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.Vendedor"
                label="Vendedor"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.FechaCompra"
                mask="date"
                label="Fecha de Compra"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"
                    ><q-popup-proxy><q-date v-model="formModel.FechaCompra" /></q-popup-proxy
                  ></q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                :readonly="soloLectura"
                v-model="formModel.Frecuencia"
                :options="opcionesFrecuencias"
                label="Frequencia de calibración"
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                :readonly="soloLectura"
                v-model="formModel.Nombre_extint"
                :options="opcionesCalibracion"
                label="Calibración Int/Ext."
                option-value="value"
                option-label="label"
                emit-value
                map-options
              />
            </div>

            <div class="col-12">
              <q-input
                filled
                :readonly="soloLectura"
                v-model="formModel.Informacion"
                type="textarea"
                label="Información adicional"
              />
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
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span class="q-ml-sm">¿Deseas cambiar el estado de este Gage?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="No" color="primary" v-close-popup />
        <q-btn flat label="Sí, cambiar" color="negative" @click="toggleEstado" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const index = () => router.push('/') // Redirige a la raíz

// --- ESTADOS DE CONTROL ---
const search = ref('')
const rows = ref([]) // <--- FALTABA DECLARAR
const loading = ref(false) // <--- FALTABA DECLARAR
const Form = ref(false)
const confirm = ref(false)
const modoEdicion = ref(false)
const soloLectura = ref(false)
const GageSeleccionado = ref(null)
const backdropFilter = ref('blur(4px)')

// --- MODELO DEL FORMULARIO ---
const formModel = ref({
  GageId: '',         // Antes gageId
  GageSerie: '',     // Nuevo campo para el número de serie
  Descripcion: '',    // Antes description
  Tipo: null,         // Antes tipo
  Estado: null,       // Antes estado
  Locacion: '',       // Antes localizacion (revisa si es Locacion o LocacionId)
  Vendedor: '',       // Antes vendedor
  FechaCompra: '',    // Antes fechaCompra
  Frecuencia: null, // Antes frecuencia
  Nombre_extint: null,       // Antes calibracionTipo
  Informacion: '',    // Antes infoExtra
  Act_Inact: 1        // Antes activo
})

// Opciones para los selects
const opcionesTipo = [
  { label: 'Mecanico', value: 1 },
  { label: 'Digital', value: 2 },
  { label: 'Electrico', value: 3 },
];
const opcionesEstado = [
  { label: 'Aprobado', value: 1 },
  { label: 'Rechazado', value: 2 },
];
const opcionesFrecuencias = [
  { label: '1 meses', value: 1 },
  { label: '3 meses', value: 2 },
  { label: '6 meses', value: 3 },
  { label: '12 meses', value: 4 },
];
const opcionesCalibracion = [
  { label: 'Interna', value: 1 },
  { label: 'Externa', value: 2 }
];

// --- CONFIGURACIÓN DE TABLA ---
const columns = [
  { name: 'GageId', label: '#', field: 'GageId', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'GageSerie', label: 'GageID', field: 'GageSerie', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'description', label: 'Nombre del Gage', field: 'Descripcion', align: 'left', sortable: true }, // Era 'Descripcion', no 'description'
  { name: 'estado', label: 'Estado', field: 'Act_Inact', align: 'center', sortable: true}, // 'Act_Inact' es el campo de tu DB
  { name: 'actions', label: 'Acciones', align: 'center' },
]

// logica para el filtrado de gages en la tabla
const gagesFiltrados = computed(() => {
  if (!search.value) return rows.value
  const s = search.value.toLowerCase()
  return rows.value.filter(
    (g) => 
      String(g.GageId).toLowerCase().includes(s) || 
      g.Descripcion?.toLowerCase().includes(s) ||
      g.GageSerie?.toLowerCase().includes(s) // Agregué GageSerie también
  )
})

// --- Funciones de la API ---
// API para obtener los gages desde el backend
const obtenerGages = async () => {
  loading.value = true
  try {
    const respuesta = await api.get('/api/gages')
    rows.value = respuesta.data
  } catch (error) {
    console.error('Error al traer gages:', error)
  } finally {
    loading.value = false
  }
}

const onSubmit = () => {
  if (modoEdicion.value) {
    actualizarGage()
  } else {
    insertarGage()
  }
}

const insertarGage = async () => {
  try {
    const p = formModel.value; // Usamos un alias corto para limpiar el código

    const bodyEnvio = {
      // Nombres exactos según tu tabla 'gage_master'
      GageSerie: p.GageSerie,
      Descripcion: p.Descripcion,
      Usuario: 1, // ID fijo de prueba o dinámico
      Tipo: Number(p.Tipo) || 1,
      Estado: Number(p.Estado) || 1,
      Act_Inact: 1,
      Ex_Int: Number(p.Nombre_extint) || 1,
      Vendedor: p.Vendedor,
      FechaCompra: p.FechaCompra,
      FreqCalibracion: Number(p.Frecuencia) || 1,
      Locacion: p.Locacion,
      Informacion: p.Informacion,
      ProcedimientoId: Number(p.ProcedimientoId) || 1
    };


    await api.post('/api/gages', bodyEnvio);
    Form.value = false;
    obtenerGages();
    alert('¡Registrado con éxito!');
  } catch (error) {
    // Si el error persiste aquí, el problema está en el req.body del backend
    console.error("Error detallado:", error.response?.data);
    alert('Error 500: Revisa que el backend use los mismos nombres de campo.');
  }
};

const actualizarGage = async () => {
  try {
    const payload = { ...formModel.value };

    // Eliminamos 'extraerId' porque no la estamos usando y 
    // mejor usamos Number() directamente para asegurar la integridad en MySQL.

    const bodyEnvio = {
      GageId: payload.GageId,
      GageSerie: payload.GageSerie,
      Descripcion: payload.Descripcion,
      Vendedor: payload.Vendedor,
      FechaCompra: payload.FechaCompra,
      Informacion: payload.Informacion,
      Act_Inact: payload.Act_Inact,
      Locacion: payload.Locacion,
      // Aquí es donde aseguramos que no mande NULL a las llaves foráneas
      Tipo: Number(payload.Tipo) || 1,
      Estado: Number(payload.Estado) || 1,
      FreqCalibracion: Number(payload.Frecuencia) || 1,
      Ex_Int: Number(payload.Nombre_extint) || 1,
      Usuario: 1, 
      ProcedimientoId: Number(payload.ProcedimientoId) || 1
    };


    await api.put(`/api/gages/${formModel.value.GageId}`, bodyEnvio);
    Form.value = false;
    obtenerGages();
    alert('¡Gage actualizado correctamente!');
  } catch (error) {
    console.error(error);
    alert('Error al actualizar: Revisa que los IDs existan en la base de datos.');
  }
};

// --- FUNCIONES DE CONTROL DEL FORMULARIO ---

function abrirFormulario() {
  soloLectura.value = false
  modoEdicion.value = false
  // Resetear el modelo
  formModel.value = {
    GageId: '',         // Antes gageId
    GageSerie: '',     // Nuevo campo para el número de serie
    Descripcion: '',    // Antes description
    Tipo: null,         // Antes tipo
    Estado: null,       // Antes estado
    Locacion: '',       // Antes localizacion (revisa si es Locacion o LocacionId)
    Vendedor: '',       // Antes vendedor
    FechaCompra: '',    // Antes fechaCompra
    Frecuencia: null, // Antes frecuencia
    Nombre_extint: null,       // Antes calibracionTipo
    Informacion: '',    // Antes infoExtra
    Act_Inact: 1 
  }
  Form.value = true
}

function prepararEdicion(row) {
  soloLectura.value = false
  modoEdicion.value = true
  
  formModel.value = { 
    ...row,
    // Importante: El SELECT de tu backend debe traer estos campos "Id"
    Tipo: row.TipoId, 
    Estado: row.EstadoId,
    Frecuencia: row.FreqId,
    Nombre_extint: row.ExIntId,
    ProcedimientoId: row.ProcedimientoId || 1
  } 
  Form.value = true
}

function verDetalles(row) {
  soloLectura.value = true
  modoEdicion.value = false
  formModel.value = { ...row }
  Form.value = true
}

// Abre el mini-diálogo de confirmación
const confirmarInactivar = (row) => {
  GageSeleccionado.value = row
  confirm.value = true
}

const toggleEstado = async () => {
  if (!GageSeleccionado.value) return
  
  try {
    // Si el ID actual es 1 (Activo), mandamos 2 (Inactivo). Si no, mandamos 1.
    const nuevoValor = GageSeleccionado.value.Act_Inact == 1 ? 2 : 1;

    // Llamamos a la nueva ruta /status/
    await api.put(`/api/gages/status/${GageSeleccionado.value.GageId}`, { 
      activo: nuevoValor 
    });

    obtenerGages(); // Refrescamos la tabla para que el JOIN traiga los nombres nuevos
    confirm.value = false; // Cerramos el modal de confirmación
  } catch (error) {
    console.error(error);
    alert('No se pudo cambiar el estado');
  }
}

const onReset = () => {
  abrirFormulario()
}

onMounted(() => {
  obtenerGages()
})
</script>
