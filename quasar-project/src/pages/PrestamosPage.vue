<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>

  <div class="text-h3 flex flex-center" style="font-weight: bold; margin: 10px">Préstamos</div>

  <q-card class="my-card" style="max-width: 900px; margin: 0 auto; margin-top: 20px">
    <q-card-section>
      <q-btn label="Nuevo registro" icon="add" color="primary" @click="abrirFormulario" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-h6 q-mb-md">Historial de préstamos</div>
      <q-table
        
        :rows="rows"
        :columns="columns"
        :filter="search"
        row-key="NoEmpleado"
        flat
        bordered
      >
        <template v-slot:top-right>
          <q-input v-model="search" dense debounce="300" placeholder="Buscar Empleado">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn 
              v-if="props.row.HoraDevuelto === '--:--'"
              color="warning" 
              icon="history" 
              label="Devolver"
              size="sm"
              @click="prepararDevolucion(props.row)"
            />
            <q-badge v-else color="green" label="Completado" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <q-dialog v-model="mostrarFormulario" persistent :backdrop-filter="backdropFilter">
    <q-card style="min-width: 500px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Nuevo Registro de Préstamo</div>
      </q-card-section>

      <q-card-section class="row q-col-gutter-md q-pt-lg">
        <div class="col-6">
          <q-input filled dense v-model="formPrestamo.Nombre" label="Nombre" />
        </div>
        <div class="col-6">
          <q-input filled dense v-model="formPrestamo.NoEmpleado" label="No. Empleado" />
        </div>
        <div class="col-6">
          <q-input filled dense v-model="formPrestamo.Turno" label="Turno" />
        </div>
        <div class="col-6">
          <q-input filled dense v-model="formPrestamo.Gage" label="Gage" />
        </div>
        <div class="col-12">
          <q-input filled dense v-model="formPrestamo.Area" label="Área" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn label="Registrar Prestamo" color="primary" @click="registrarPrestamo" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="mostrarReloj" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <q-avatar icon="history" color="primary" text-color="white" />
        <div class="q-ml-sm">
          <div class="text-weight-bold">Confirmar Recepción</div>
          <div>Gage: {{ itemSeleccionado?.Gage }}</div>
        </div>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-grey-7 text-subtitle2">Hora actual de entrada:</div>
        <h1 class="text-h3 text-primary text-weight-bold q-ma-none">
          {{ horaActual }}
        </h1>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn label="Confirmar Devolución" color="primary" @click="procesarDevolucion" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const index = () => router.push('/')

// --- VARIABLES DE ESTADO ---
const search = ref('')
const horaActual = ref('')
const mostrarFormulario = ref(false)
const mostrarReloj = ref(false)
const itemSeleccionado = ref(null)
const backdropFilter = ref('blur(4px)')

// --- FORMULARIO ---
const formPrestamo = ref({
  NoEmpleado: '',
  Nombre: '',
  Turno: '',
  Gage: '',
  Area: '',
  HoraPrestamo: '',
  HoraDevuelto: '--:--'
})

// --- TABLA ---
const columns = [
  { name: 'noEmpleado', label: 'No. Empleado', field: 'NoEmpleado', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'Nombre', align: 'left' },
  { name: 'gage', label: 'Gage', field: 'Gage', align: 'left' },
  { name: 'area', label: 'Área', field: 'Area', align: 'left' },
  { name: 'horaEntrega', label: 'Hora Prestamo', field: 'HoraPrestamo', align: 'left' },
  { name: 'horaDevuelto', label: 'Hora Devolución', field: 'HoraDevuelto', align: 'left' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const rows = ref([
  { NoEmpleado: '12345', Nombre: 'Juan Perez',  Area: 'Producción', Gage: 'NID-001', HoraPrestamo: '08:00', HoraDevuelto: '17:00' },
  { NoEmpleado: '67890', Nombre: 'Maria Lopez', Area: 'Calidad', Gage: 'NID-002', HoraPrestamo: '09:30', HoraDevuelto: '--:--' }
])

// --- LOGICA DEL RELOJ ---
const obtenerHora = () => {
  const ahora = new Date()
  horaActual.value = ahora.toLocaleTimeString('es-MX', { hour12: false })
}

let intervalo = null

onMounted(() => {
  obtenerHora()
  intervalo = setInterval(obtenerHora, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})

// --- ACCIONES ---
const abrirFormulario = () => {
  formPrestamo.value = { NoEmpleado: '', Nombre: '', Turno: '', Gage: '', Area: '', HoraPrestamo: '', HoraDevuelto: '--:--' }
  mostrarFormulario.value = true
}

const registrarPrestamo = () => {
  // Capturamos la hora actual al momento de registrar el nuevo préstamo
  formPrestamo.value.HoraPrestamo = horaActual.value
  rows.value.unshift({ ...formPrestamo.value }) // Agregamos al inicio de la tabla
  mostrarFormulario.value = false
}

const prepararDevolucion = (row) => {
  itemSeleccionado.value = row
  mostrarReloj.value = true
}

const procesarDevolucion = () => {
  if (itemSeleccionado.value) {
    // Buscamos el registro en la tabla y actualizamos su hora de devolución
    const index = rows.value.findIndex(r => r.NoEmpleado === itemSeleccionado.value.NoEmpleado && r.HoraDevuelto === '--:--')
    if (index !== -1) {
      rows.value[index].HoraDevuelto = horaActual.value
    }
  }
  mostrarReloj.value = false
}
</script>
