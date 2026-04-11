<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>

  <div class="text-h3 flex flex-center" style="font-weight: bold; margin: 10px">Préstamos</div>

  <q-card class="my-card" style="max-width: 1200px; margin: 0 auto; margin-top: 20px">
    <q-card-section class="row items-center q-pb-none">
      <q-btn label="Nuevo registro" icon="add" color="primary" @click="abrirFormulario" />
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
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">Historial de préstamos</div>
      <q-table
        :rows="prestamoFiltrados"
        :columns="columns"
        :loading="loading"
        row-key="PrestamoId"
        flat
        bordered
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn 
              v-if="!props.row.HDevolucion" 
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
  <q-select 
    filled 
    dense 
    v-model="formPrestamo.TurnoId" 
    :options="opcionesTurnos" 
    label="Seleccionar Turno"
    emit-value
    map-options
    @update:model-value="val => $q.notify({ message: `Turno ${val} seleccionado`, color: 'info', timeout: 500 })"
  >
    <template v-slot:prepend>
      <q-icon name="schedule" />
    </template>
  </q-select>
</div>
        <div class="col-6">
          <q-select filled dense v-model="formPrestamo.GageId" label="Seleccionar Gage Disponible" :options="opcionesGages" emit-value map-options/>
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
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn label="Confirmar Devolución" color="primary" @click="procesarDevolucion" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from "boot/axios"
import { useQuasar } from 'quasar'

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
const backdropFilter = ref('blur(4px)')

// --- FORMULARIO ---
const formPrestamo = ref({
  NoEmpleado: '',
  Nombre: '',
  TurnoId: '',
  GageId: '',
  Area: ''
})

// --- TABLA ---
const columns = [
  { name: 'NoEmpleado', label: 'No. Empleado', field: 'NoEmpleado', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'Nombre', align: 'left', sortable: true },
  { name: 'gage', label: 'Gage', field: 'GageSerie', align: 'left' },
  { name: 'area', label: 'Área', field: 'Area', align: 'left' },
  { name: 'horaEntrega', label: 'Hora Préstamo', field: 'HPrestamo', align: 'left' },
  { name: 'horaDevuelto', label: 'Hora Devolución', field: 'HDevolucion', align: 'left' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]


// --- LÓGICA DE FILTRADO ---
const prestamoFiltrados = computed(() => {
  if (!search.value) return rows.value
  const s = search.value.toLowerCase()
  return rows.value.filter(row => 
    String(row.Nombre).toLowerCase().includes(s) || 
    String(row.NoEmpleado).includes(s) ||
    String(row.GageId).includes(s)
  )
})

// Funciones de la API

const obtenerPrestamos = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/prestamo')
    rows.value = data
  } catch (error) {
    console.error("Error en la operación:", error);
    $q.notify({ color: 'negative', message: 'Error al cargar historial' })
  } finally {
    loading.value = false
  }
}

const abrirFormulario = () => {
  formPrestamo.value = { 
    NoEmpleado: '', 
    Nombre: '', 
    TurnoId: '', 
    GageId: '', 
    Area: '' 
  }
  mostrarFormulario.value = true
}

const registrarPrestamo = async () => {
  try {
    // Validación rápida con Notify
    if (!formPrestamo.value.GageId || !formPrestamo.value.TurnoId) {
      $q.notify({ color: 'warning', message: 'Por favor selecciona Gage y Turno' });
      return;
    }

    const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const bodyEnvio = {
      NoEmpleado: Number(formPrestamo.value.NoEmpleado),
      Nombre: formPrestamo.value.Nombre,
      GageId: formPrestamo.value.GageId,    // Viene del q-select de Gages
      TurnoId: formPrestamo.value.TurnoId,  // Viene del q-select de Turnos
      Area: formPrestamo.value.Area,
      HPrestamo: ahora
    };

    await api.post('/api/prestamo', bodyEnvio);
    
    $q.notify({ 
      color: 'positive', 
      icon: 'done', 
      message: 'Préstamo registrado con éxito en Q-GAGE' 
    });

    mostrarFormulario.value = false;

    formPrestamo.value = { 
      NoEmpleado: '', 
      Nombre: '', 
      TurnoId: '', 
      GageId: '', 
      Area: '' 
    };


    await cargarGagesDisponibles(); 
    await obtenerPrestamos(); // Refresca la tabla del historial

  } catch (error) {
    console.error("Error en inserción:", error); // Solución al error de variable no usada
    $q.notify({ 
      color: 'negative', 
      message: 'Fallo al insertar: Revisa que el ID del Gage sea válido' 
    });
  }
};

const prepararDevolucion = (row) => {
  itemSeleccionado.value = row
  mostrarReloj.value = true
}

const procesarDevolucion = async () => {
  try {
    const ahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await api.put(`/api/prestamo/${itemSeleccionado.value.PrestamoId}`, {
      devolucion: ahora
    });

    $q.notify({ color: 'positive', message: 'Gage devuelto y disponible' });
    
    mostrarReloj.value = false;

    // --- ESTO ES LO IMPORTANTE ---
    await obtenerPrestamos();        // Refresca la tabla de historial
    await cargarGagesDisponibles();  // Refresca la lista del q-select para el próximo préstamo
    // -----------------------------

  } catch (error) {
    console.error(error);
    $q.notify({ color: 'negative', message: 'Error al procesar devolución' });
  }
};

const opcionesTurnos = [
  { label: 'Turno A', value: 1 },
  { label: 'Turno B', value: 2 },
  { label: 'Turno C', value: 3 },
  { label: 'Turno D', value: 4 }
]

const opcionesGages = ref([]);

const cargarGagesDisponibles = async () => {
  try {
    const { data } = await api.get('/api/gages/disponibles');
    // Mapeamos para que Quasar lo entienda (label para mostrar, value para guardar)
    opcionesGages.value = data.map(g => ({
      label: `${g.GageSerie} - ${g.Descripcion}`,
      value: g.GageId
    }));
  } catch (error) {
    console.error(error);
  }
};

// --- LOGICA DEL RELOJ ---
const obtenerHora = () => {
  const ahora = new Date()
  horaActual.value = ahora.toLocaleTimeString('es-MX', { hour12: false })
}

let intervalo = null

onMounted(() => {
  obtenerPrestamos()
  cargarGagesDisponibles();
  obtenerHora()
  intervalo = setInterval(obtenerHora, 1000)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>
