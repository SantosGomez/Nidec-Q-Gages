<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      <div class="row items-center q-mb-xl">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Gestión de Gages</div>
        <q-space />
        <!-- Esto empuja lo que sigue a la derecha -->
        <q-btn
          v-if="authStore.usuario?.edit_gage"
          color="primary"
          icon="add"
          label="Nuevo Gage"
          @click="abrirFormulario"
          padding="sm lg"
        />
      </div>
    

      <q-card class="my-card shadow-1 shadow-up-1">
        <q-card-section>
          <q-table
            :rows="gagesFiltrados"
            :columns="columns"
            :loading="loading"
            row-key="GageId"
            flat
            dense
          >
            <template v-slot:top-right>
              <q-input
                v-model="search"
                dense
                outlined
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
                  unelevated
                  @click="confirmarInactivar(props.row)"
                  :disable="!authStore.usuario?.edit_gage"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn
                  v-if="authStore.usuario?.edit_gage"
                  outline
                  round
                  color="warning"
                  icon="edit"
                  @click="prepararEdicion(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="authStore.usuario?.edit_gage"
                  outline
                  round
                  color="secondary"
                  icon="content_copy"
                  @click="duplicarGage(props.row)"
                >
                  <q-tooltip>Duplicar Gage</q-tooltip>
                </q-btn>
                <q-btn outline round color="info" icon="visibility" @click="verDetalles(props.row)">
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
      <q-card style="width: 100%; max-width: 1300px">
        <q-card-section :class="[colorHeader, 'text-white row items-center']">
          <div class="text-h4">
          <q-icon :name="soloLectura ? 'visibility' : (modoEdicion ? 'edit' : 'add')" class="q-mr-sm" />
            {{ tituloDialogo }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit="onSubmit" @reset="onReset">
          <q-scroll-area class="full-width" style="max-width: 90vw; height: 500px">
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formModel.GageSerie"
                    label="Gage Serie"
                    :readonly="soloLectura || (modoEdicion && !authStore.usuario?.edit_gageId)"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :readonly="soloLectura"
                    v-model="formModel.Descripcion"
                    label="Nombre del Gage"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
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
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="formModel.PlantillaNombre"
                    :options="opcionesPlantillas"
                    option-value="GageTipo"
                    option-label="GageTipo"
                    emit-value
                    map-options
                    label="Plantilla de Calibración"
                    class="q-mb-md"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-italic text-grey">
                          No hay plantillas creadas
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
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
                    :readonly="soloLectura"
                    v-model="formModel.Locacion"
                    label="Localización"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input :readonly="soloLectura" v-model="formModel.Vendedor" label="Vendedor" />
                </div>

                <div class="col-12 col-md-4">
                  <q-input
                    :readonly="soloLectura"
                    v-model="formModel.FechaAlta"
                    mask="date"
                    label="Fecha de Alta"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer"
                        ><q-popup-proxy><q-date v-model="formModel.FechaAlta" /></q-popup-proxy
                      ></q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
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
                <div class="col-12 col-md-4">
                  <q-select
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

                <div class="col-12 col-md-6">
                  <q-select
                    :readonly="soloLectura"
                    v-model="formModel.ProcedimientoId"
                    :options="Procedimientolista"
                    label="Procedimientos"
                    option-value="ProceId"
                    option-label="NombreProce"
                    emit-value
                    map-options
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input :readonly="soloLectura" v-model="formModel.Marca" label="Marca" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input :readonly="soloLectura" v-model="formModel.Modelo" label="Modelo" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :readonly="soloLectura"
                    v-model="formModel.Serie"
                    label="Numero de Serie "
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input :readonly="soloLectura" v-model="formModel.Codigo" label="Codigo" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input :readonly="soloLectura" v-model="formModel.Rango" label="Rango" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :readonly="soloLectura"
                    v-model="formModel.Resolucion"
                    label="Resolucion"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :readonly="soloLectura"
                    v-model="formModel.OrdenCompra"
                    label="Orden De Compra"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    outlined
                    :readonly="soloLectura"
                    v-model="formModel.Informacion"
                    type="textarea"
                    label="Información adicional"
                  />
                </div>
              </div>
            </q-card-section>
          </q-scroll-area>

          <q-card-actions align="right">
            <q-btn
              :label="soloLectura ? 'Cerrar' : 'CANCELAR'"
              color="negative"
              v-close-popup
              class="q-ml-sm"
            />
            <q-btn
              v-if="!soloLectura"
              :label="modoEdicion ? 'Guardar Cambios' : 'Registrar'"
              type="submit"
              color="primary"
            />
          </q-card-actions>
        </q-form>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth' // Importamos

const authStore = useAuthStore()
const $q = useQuasar()
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
const Procedimientolista = ref([])
const opcionesPlantillas = ref([])

// --- MODELO DEL FORMULARIO ---
const formModel = ref({
  GageId: '', // Antes gageId
  GageSerie: '', // Nuevo campo para el número de serie
  Descripcion: '', // Antes description
  PlantillaNombre: '', // Nuevo campo para el nombre de la plantilla
  Tipo: null, // Antes tipo
  Estado: null, // Antes estado
  Locacion: '', // Antes localizacion (revisa si es Locacion o LocacionId)
  Vendedor: '', // Antes vendedor
  FechaAlta: '', // Antes FechaAlta
  Frecuencia: null, // Antes frecuencia
  Nombre_extint: null, // Antes calibracionTipo
  Informacion: '', // Antes infoExtra
  Act_Inact: 1,
  Marca: '',
  Modelo: '',
  Codigo: '',
  Serie: '',
  Rango: '',
  Resolucion: '',
  OrdenCompra: '',
})

// Opciones para los selects
const opcionesTipo = [
  { label: 'Mecanico', value: 1 },
  { label: 'Digital', value: 2 },
  { label: 'Electrico', value: 3 },
]
const opcionesEstado = [
  { label: 'Aprobado', value: 1 },
  { label: 'Rechazado', value: 2 },
]
const opcionesFrecuencias = [
  { label: '1 meses', value: 1 },
  { label: '2 meses', value: 2 },
  { label: '3 meses', value: 3 },
  { label: '6 meses', value: 4 },
  { label: '12 meses', value: 5 },
  { label: '24 meses', value: 6 },
]
const opcionesCalibracion = [
  { label: 'Interna', value: 1 },
  { label: 'Externa', value: 2 },
]
const Manuales = async () => {
  try {
    const { data } = await api.get('/api/procedimiento/manual')
    Procedimientolista.value = [...data]
  } catch (error) {
    console.error('Error al cargar Procedimientos', error)
  }
}

const cargarPlantillas = async () => {
  try {
    const response = await api.get('/api/plantillas/nombres')
    // Mapeamos para que Quasar lea los strings directamente si es necesario
    opcionesPlantillas.value = response.data.map((p) => p.GageTipo)
  } catch (error) {
    console.error('Error cargando plantillas:', error)
  }
}

// --- CONFIGURACIÓN DE TABLA ---
const columns = [
  { name: 'GageId', label: '#', field: 'GageId', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  { name: 'GageSerie', label: 'GageID', field: 'GageSerie', align: 'left', sortable: true }, // 'GageID' en mayúsculas
  {
    name: 'description',
    label: 'Nombre del Gage',
    field: 'Descripcion',
    align: 'left',
    sortable: true,
  }, // Era 'Descripcion', no 'description'
  { name: 'estado', label: 'Estado', field: 'Act_Inact', align: 'center', sortable: true }, // 'Act_Inact' es el campo de tu DB
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
      g.GageSerie?.toLowerCase().includes(s), // Agregué GageSerie también
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
    $q.notify({ color: 'negative', message: 'Error al cargar Gages' })
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
    const p = formModel.value // Usamos un alias corto para limpiar el código

    const bodyEnvio = {
      // Nombres exactos según tu tabla 'gage_master'
      GageSerie: p.GageSerie,
      Descripcion: p.Descripcion,
      Usuario: authStore.usuario.id, // ID fijo de prueba o dinámico
      Tipo: Number(p.Tipo) || 1,
      Estado: Number(p.Estado) || 1,
      Act_Inact: 1,
      Ex_Int: Number(p.Nombre_extint) || 1,
      Vendedor: p.Vendedor,
      FechaAlta: p.FechaAlta,
      FreqCalibracion: Number(p.Frecuencia) || 1,
      Locacion: p.Locacion,
      Informacion: p.Informacion,
      ProcedimientoId: Number(p.ProcedimientoId) || 1,
      Marca: p.Marca,
      Modelo: p.Modelo,
      Codigo: p.Codigo,
      Serie: p.Serie,
      Rango: p.Rango,
      Resolucion: p.Resolucion,
      OrdenCompra: p.OrdenCompra,
      PlantillaNombre: p.PlantillaNombre, // Nuevo campo
    }

    await api.post('/api/gages', bodyEnvio)
    Form.value = false
    obtenerGages()
    $q.notify({
      color: 'positive',
      icon: 'done',
      message: 'Gage registrado éxitosamente ',
    })
  } catch (error) {
    // Si el error persiste aquí, el problema está en el req.body del backend
    console.error('Error detallado:', error.response?.data)
    $q.notify({
      color: 'negative',
      message: 'Fallo al insertar: Revisa que el ID del Gage sea válido',
    })
  }
}

const actualizarGage = async () => {
  try {
    const payload = { ...formModel.value }

    // Eliminamos 'extraerId' porque no la estamos usando y
    // mejor usamos Number() directamente para asegurar la integridad en MySQL.

    const bodyEnvio = {
      GageId: payload.GageId,
      GageSerie: payload.GageSerie,
      Descripcion: payload.Descripcion,
      Vendedor: payload.Vendedor,
      FechaAlta: payload.FechaAlta,
      Informacion: payload.Informacion,
      Act_Inact: payload.Act_Inact,
      Locacion: payload.Locacion,
      // Aquí es donde aseguramos que no mande NULL a las llaves foráneas
      Tipo: Number(payload.Tipo) || 1,
      Estado: Number(payload.Estado) || 1,
      FreqCalibracion: Number(payload.Frecuencia) || 1,
      Ex_Int: Number(payload.Nombre_extint) || 1,
      
      ProcedimientoId: Number(payload.ProcedimientoId) || 1,
      Marca: payload.Marca,
      Modelo: payload.Modelo,
      Codigo: payload.Codigo,
      Serie: payload.Serie,
      Rango: payload.Rango,
      Resolucion: payload.Resolucion,
      OrdenCompra: payload.OrdenCompra,
      PlantillaNombre: payload.PlantillaNombre, // Nuevo campo
    }

    await api.put(`/api/gages/${formModel.value.GageId}`, bodyEnvio)
    Form.value = false
    obtenerGages()
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
      message: 'Error al actualizar, revisa los campos',
    })
  }
}

// --- FUNCIONES DE CONTROL DEL FORMULARIO ---

function abrirFormulario() {
  soloLectura.value = false
  modoEdicion.value = false
  // Resetear el modelo
  formModel.value = {
    GageId: '', // Antes gageId
    GageSerie: '', // Nuevo campo para el número de serie
    Descripcion: '', // Antes description
    Tipo: null, // Antes tipo
    Estado: null, // Antes estado
    Locacion: '', // Antes localizacion (revisa si es Locacion o LocacionId)
    Vendedor: '', // Antes vendedor
    FechaAlta: '', // Antes FechaAlta
    Frecuencia: null, // Antes frecuencia
    Nombre_extint: null, // Antes calibracionTipo
    Informacion: '', // Antes infoExtra
    Act_Inact: 1,
    Marca: '',
    Modelo: '',
    Codigo: '',
    Serie: '',
    Rango: '',
    Resolucion: '',
    OrdenCompra: '',
    PlantillaNombre: '', // Nuevo campo
  }
  Form.value = true
}

function duplicarGage(row) {
  // 1. Configuramos el modal como si fuera un registro NUEVO
  soloLectura.value = false
  modoEdicion.value = false // CRÍTICO: Esto fuerza a que el submit haga un INSERT

  // 2. Copiamos los datos, pero LIMPIAMOS los campos que son únicos
  formModel.value = {
    ...row,
    // Limpiamos identificadores únicos
    GageId: '', 
    GageSerie: '', // El usuario debe teclear el nuevo NID de control
    Serie: '',     // El número de serie físico del nuevo equipo
    
    // Mapeo necesario para los q-select (igual que en edición)
    Tipo: row.TipoId,
    Estado: row.EstadoId,
    Frecuencia: row.FreqId,
    Nombre_extint: row.ExIntId,
    ProcedimientoId: row.ProcedimientoId || 1,
  }

  // 3. Abrimos el formulario
  Form.value = true

  // 4. (Opcional) Un pequeño aviso para guiar al usuario
  $q.notify({
    color: 'info',
    icon: 'content_copy',
    message: 'Copia lista. Por favor, asigna el nuevo Gage Serie y Número de Serie del fabricante.',
    position: 'top-right'
  })
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
    ProcedimientoId: row.ProcedimientoId || 1,
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
    const nuevoValor = GageSeleccionado.value.Act_Inact == 1 ? 2 : 1

    // Llamamos a la nueva ruta /status/
    await api.put(`/api/gages/status/${GageSeleccionado.value.GageId}`, {
      activo: nuevoValor,
    })

    obtenerGages() // Refrescamos la tabla para que el JOIN traiga los nombres nuevos
    confirm.value = false // Cerramos el modal de confirmación
  } catch (error) {
    console.error(error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'No se pudo cambiar Estado',
    })
  }
}

const tituloDialogo = computed(() => {
  if (soloLectura.value) return 'Ficha Técnica del Gage'
  if (modoEdicion.value) return 'Editar Gage'
  return 'Nuevo Gage'
})

const colorHeader = computed(() => {
  if (soloLectura.value) return 'bg-blue-grey-9' // Color sobrio para consulta
  if (modoEdicion.value) return 'bg-orange-8'    // Color de advertencia para edición
  return 'bg-primary'                           // Color institucional para nuevo registro
})

const onReset = () => {
  abrirFormulario()
}

onMounted(() => {
  obtenerGages()
  Manuales()
  cargarPlantillas()
})
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
}
.sticky-header-table thead tr {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
</style>
