<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div style="max-width: 1200px; width: 100%" class="q-px-md q-mx-auto">
      <div class="row items-center q-mb-xl">
        <q-btn flat round color="primary" icon="arrow_back" @click="index" class="q-mr-md" />
        <div class="text-h4 text-weight-bolder text-blue-grey-9">Prestamos de Gages</div>
        <q-space />
        <!-- Esto empuja lo que sigue a la derecha -->
        <q-btn
          padding="sm lg"
          label="Nuevo registro"
          icon="add"
          color="primary"
          @click="abrirFormulario"
        />
      </div>
      <q-card class="my-card shadow-1 shadow-up-1">
        <q-card-section>
          <q-table
            :rows="prestamoFiltrados"
            :columns="columns"
            :loading="loading"
            row-key="PrestamoId"
            flat
            class="tabla-sticky"
          >
            <template v-slot:top>
              <div class="row q-gutter-md full-width items-center">
                <q-select
                  v-model="filtroArea"
                  :options="opcionesAreas"
                  label="Filtrar por Area"
                  dense
                  outlined
                  style="min-width: 150px"
                />
                <q-select
                  v-model="filtroTurno"
                  :options="['Todos', 'Turno A', 'Turno B', 'Turno C', 'Turno D']"
                  label="Filtrar por Turno"
                  dense
                  outlined
                  style="min-width: 150px"
                />

                <q-toggle
                  v-model="soloPendientes"
                  label="Solo pendientes de entrega"
                  color="orange"
                />
                <q-space />
                <q-input
                  v-model="search"
                  dense
                  outlined
                  debounce="300"
                  placeholder="Buscar Empleado o Gage..."
                  style="width: 300px"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </template>
            <template v-slot:body-cell-horaEntrega="props">
              <q-td :props="props">
                {{ formatearFecha(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-horaDevuelto="props">
              <q-td :props="props" class="text-grey-9">
                {{ formatearFecha(props.value) }}
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <!-- La condición va aquí adentro, en el botón -->
                <q-btn
                  v-if="!!authStore.usuario?.edit_prestamo"
                  round
                  outline
                  color="warning"
                  icon="edit"
                  @click="EditarRegistro(props.row)"
                >
                  <q-tooltip>Editar registro</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-devolucion="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  v-if="!props.row.HDevolucion || props.row.HDevolucion.startsWith('0000')"
                  color="warning"
                  icon="history"
                  label="Devolver"
                  size="sm"
                  @click="prepararDevolucion(props.row)"
                />
                <q-badge v-else color="green" label="Completado" padding="5px 10px" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

  <q-dialog v-model="mostrarFormulario" persistent :backdrop-filter="backdropFilter">
    <q-card style="max-width: 800px; width: 100%">
      <q-card-section :class="[colorHeader, 'text-white']">
        <div class="text-h6">
          {{ esEdicion ? 'Editar Préstamo' : 'Nuevo Registro de Préstamo' }}
        </div>
      </q-card-section>

      <q-card-section class="row q-col-gutter-md q-pt-lg">
        <div class="col-12 col-md-6">
          <q-input outlined dense v-model="formPrestamo.Nombre" label="Nombre" />
        </div>
        <div class="col-12 col-md-6">
          <q-input outlined dense v-model="formPrestamo.NoEmpleado" label="No. Empleado" />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            outlined
            dense
            v-model="formPrestamo.TurnoId"
            :options="opcionesTurnos"
            label="Seleccionar Turno"
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="schedule" />
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-6">
          <q-select
            outlined
            dense
            v-model="formPrestamo.GageId"
            label="Seleccionar Gage Disponible"
            :options="opcionesGages"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            multiple
            use-chips
            counter
            stack-label
            hide-dropdown-icon
            :readonly="true"
          >
            <template v-slot:append>
              <q-btn icon="add" flat @click.stop="GagesDisponles = true" />
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-12">
          <q-input outlined dense v-model="formPrestamo.Area" label="Área" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn
          :label="esEdicion ? 'Guardar Cambios' : 'Registrar Prestamo'"
          color="primary"
          @click="esEdicion ? ActualizarPrestamo() : registrarPrestamo()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="mostrarReloj" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <q-avatar icon="history" color="primary" text-color="white" />
        <div class="q-ml-sm">
          <div class="text-weight-bold">Confirmar Recepción</div>
          <div>Gage: {{ itemSeleccionado?.GageSerie }}</div>
        </div>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-grey-7 text-subtitle2">Hora actual de entrada:</div>
        <h1 class="text-h3 text-primary text-weight-bold q-ma-none">
          {{ horaActual }}
        </h1>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn label="Confirmar Devolución" color="primary" @click="procesarDevolucion" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="GagesDisponles" persistent :backdrop-filter="backdropFilter">
    <q-card style="width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Seleccionar Gages Disponibles</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- Tabla con selección múltiple -->
        <q-table
          :rows="opcionesGagesRaw"
          :columns="columnasSelector"
          row-key="GageId"
          selection="multiple"
          v-model:selected="seleccionadosEnTabla"
          :filter="filtroBusqueda"
        >
          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filtroBusqueda" placeholder="Buscar Gage...">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Seleccionar" color="primary" @click="confirmarGages" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()
const index = () => router.push('/')

// --- VARIABLES DE ESTADO ---
const search = ref('')
const rows = ref([])
const loading = ref(false)
const horaActual = ref('')
const mostrarFormulario = ref(false)
const mostrarReloj = ref(false)
const itemSeleccionado = ref(null)
const GagesDisponles = ref(false)
const seleccionadosEnTabla = ref([])
const filtroBusqueda = ref('')
const opcionesGagesRaw = ref([])
const backdropFilter = ref('blur(4px)')
const esEdicion = ref(false)
const prestamoIdParaEditar = ref(null)

// --- FORMULARIO ---
const formPrestamo = ref({
  NoEmpleado: '',
  Nombre: '',
  TurnoId: '',
  GageId: [],
  Area: '',
})

// --- TABLA ---
const columns = [
  { name: 'NoEmpleado', label: 'No. Empleado', field: 'NoEmpleado', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'Nombre', align: 'left', sortable: true },
  { name: 'TurnoNombre', label: 'Turno', field: 'TurnoNombre', align: 'left', sortable: true },
  { name: 'gage', label: 'Gage', field: 'GageSerie', align: 'left', sortable: true },
  { name: 'area', label: 'Área', field: 'Area', align: 'left' },
  { name: 'horaEntrega', label: 'Hora Préstamo', field: 'HPrestamo', align: 'left' },
  { name: 'horaDevuelto', label: 'Hora Devolución', field: 'HDevolucion', align: 'left' },
  { name: 'actions', label: 'Acciones', align: 'center' },
  { name: 'devolucion', label: 'Estatus', align: 'center' },
]

const columnasSelector = [
  { name: 'GageSerie', label: 'Gage ID', field: 'GageSerie', align: 'left', sortable: true },
  { name: 'Descripcion', label: 'Nombre', field: 'Descripcion', align: 'left' },
]

// --- LÓGICA DE FILTRADO ---

const filtroTurno = ref('Todos')
const opcionesAreas = ref(['Todas'])
const filtroArea = ref('Todas')
const soloPendientes = ref(false)
const Areas = async () => {
  try {
    const { data } = await api.get('/api/prestamo/areas')
    opcionesAreas.value = ['Todas', ...data]
  } catch (error) {
    console.error('Error al cargar areas', error)
  }
}

const prestamoFiltrados = computed(() => {
  let lista = rows.value
  if (filtroTurno.value !== 'Todos') {
    lista = lista.filter((row) => row.TurnoNombre === filtroTurno.value)
  }
  if (soloPendientes.value) {
    lista = lista.filter(
      (row) =>
        !row.HDevolucion || row.HDevolucion === '--:--' || row.HDevolucion.startsWith('0000'),
    )
  }
  if (filtroArea.value !== 'Todas') {
    lista = lista.filter((row) => row.Area === filtroArea.value)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    lista = lista.filter(
      (row) =>
        String(row.Nombre || '')
          .toLowerCase()
          .includes(s) ||
        String(row.NoEmpleado || '').includes(s) ||
        String(row.GageSerie || '')
          .toLowerCase()
          .includes(s),
    )
  }
  return lista
})

// Funciones de la API

const obtenerPrestamos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/prestamo')
    rows.value = data
  } catch (error) {
    console.error('Error en la operación:', error)
    $q.notify({ color: 'negative', message: 'Error al cargar historial' })
  } finally {
    loading.value = false
  }
}

const abrirFormulario = () => {
  esEdicion.value = false
  prestamoIdParaEditar.value = null
  formPrestamo.value = {
    NoEmpleado: '',
    Nombre: '',
    TurnoId: '',
    GageId: [],
    Area: '',
  }
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  esEdicion.value = false
  prestamoIdParaEditar.value = null
}

const confirmarGages = () => {
  // Mapeamos los seleccionados de la tabla al arreglo del formulario
  formPrestamo.value.GageId = seleccionadosEnTabla.value.map((g) => g.GageId)

  GagesDisponles.value = false

  // Limpiamos la selección de la tabla para la próxima vez
  seleccionadosEnTabla.value = []

  $q.notify({
    message: `${formPrestamo.value.GageId.length} gages seleccionados`,
    color: 'positive',
  })
}

const EditarRegistro = (row) => {
  esEdicion.value = true
  prestamoIdParaEditar.value = row.PrestamoId
  formPrestamo.value = {
    NoEmpleado: row.NoEmpleado,
    Nombre: row.Nombre,
    TurnoId: row.TurnoId, // Asegúrate que el TurnoId venga en la fila
    Area: row.Area,
    GageId: [row.GageId], // Lo ponemos como array porque tu select es múltiple[cite: 8]
  }

  mostrarFormulario.value = true
}

const registrarPrestamo = async () => {
  try {
    // Validación rápida con Notify
    if (!formPrestamo.value.GageId || !formPrestamo.value.TurnoId) {
      $q.notify({ color: 'warning', message: 'Por favor selecciona Gage y Turno' })
      return
    }

    const bodyEnvio = {
      NoEmpleado: Number(formPrestamo.value.NoEmpleado),
      Nombre: formPrestamo.value.Nombre,
      GageId: formPrestamo.value.GageId,
      TurnoId: formPrestamo.value.TurnoId,
      Area: formPrestamo.value.Area,
    }

    await api.post('/api/prestamo', bodyEnvio)

    $q.notify({
      color: 'positive',
      icon: 'done',
      message: 'Préstamo registrado con éxito en Q-GAGE',
    })

    mostrarFormulario.value = false

    formPrestamo.value = {
      NoEmpleado: '',
      Nombre: '',
      GageId: [],
      TurnoId: '',
      Area: '',
    }

    await cargarGagesDisponibles()
    await obtenerPrestamos() // Refresca la tabla del historial
    await Areas()
  } catch (error) {
    console.error('Error en inserción:', error) // Solución al error de variable no usada
    $q.notify({
      color: 'negative',
      message: 'Fallo al insertar: Revisa que el ID del Gage sea válido',
    })
  }
}

const ActualizarPrestamo = async () => {
  try {
    // Validamos que tengamos el ID del registro a editar
    if (!prestamoIdParaEditar.value) return

    const bodyEnvio = {
      NoEmpleado: Number(formPrestamo.value.NoEmpleado),
      Nombre: formPrestamo.value.Nombre,
      GageId: formPrestamo.value.GageId,
      TurnoId: formPrestamo.value.TurnoId,
      Area: formPrestamo.value.Area,
    }

    // Cambiamos POST por PUT y agregamos el ID a la ruta
    await api.put(`/api/prestamo/${prestamoIdParaEditar.value}`, bodyEnvio)

    $q.notify({
      color: 'positive',
      icon: 'cloud_done',
      message: 'Registro actualizado con éxito',
    })

    cerrarFormulario() // Función para limpiar todo
    await obtenerPrestamos() // Refresca la tabla
  } catch (error) {
    console.error('Error al actualizar:', error)
    $q.notify({
      color: 'negative',
      message: 'No se pudo actualizar el registro',
    })
  }
}

const prepararDevolucion = (row) => {
  itemSeleccionado.value = row
  mostrarReloj.value = true
}

const procesarDevolucion = async () => {
  try {
    await api.put(`/api/prestamo/${itemSeleccionado.value.PrestamoId}`)

    $q.notify({ color: 'positive', message: 'Gage devuelto y disponible' })

    mostrarReloj.value = false

    // --- ESTO ES LO IMPORTANTE ---
    await obtenerPrestamos() // Refresca la tabla de historial
    await cargarGagesDisponibles() // Refresca la lista del q-select para el próximo préstamo
    await Areas()
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Error al procesar devolución' })
  }
}

const opcionesTurnos = [
  { label: 'Turno A', value: 1 },
  { label: 'Turno B', value: 2 },
  { label: 'Turno C', value: 3 },
  { label: 'Turno D', value: 4 },
]

const opcionesGages = ref([])

const cargarGagesDisponibles = async () => {
  try {
    const { data } = await api.get('/api/gages/disponibles')
    opcionesGagesRaw.value = data // La data completa para la tabla del diálogo

    opcionesGages.value = data.map((g) => ({
      label: `${g.GageSerie} - ${g.Descripcion}`,
      value: g.GageId,
    }))
  } catch (error) {
    console.error(error)
  }
}

// --- LOGICA DEL RELOJ ---
const obtenerHora = () => {
  const ahora = new Date()
  horaActual.value = ahora.toLocaleTimeString('es-MX', { hour12: false })
}

let intervalo = null

const formatearFecha = (fechaString) => {
  if (!fechaString || fechaString === '--:--' || fechaString.startsWith('0000')) {
    return '--:--'
  }

  const fecha = new Date(fechaString)
  if (isNaN(fecha)) return fechaString

  // Usamos 'en-GB' o 'es-MX' con hour12: false para forzar las 24h
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', // Opcional, por si Nidec requiere precisión de segundos
    hour12: false,
  }).format(fecha)
}
const colorHeader = computed(() => {
  if (esEdicion.value) return 'bg-orange-8'    // Color de advertencia para edición
  return 'bg-primary'                           // Color institucional para nuevo registro
})


onMounted(() => {
  obtenerPrestamos()
  cargarGagesDisponibles()
  obtenerHora()
  Areas()
  intervalo = setInterval(obtenerHora, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
}
.tabla-sticky {
  height: 450px; /* Ajusta esta altura según prefieras */
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