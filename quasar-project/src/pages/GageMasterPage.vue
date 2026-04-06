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
          @click="abrirFormulario()"
          class="q-px-lg"
          size="large"
          />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="rows"
          :columns="columns"
          :filter="search"
          row-key="gageId"
          flat
          bordered
        >
          <template v-slot:top-right>
            <q-input v-model="search" dense debounce="300" placeholder="Buscar Gage">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-btn 
                :color="props.row.activo ? 'primary' : 'grey-7'" 
                :icon="props.row.activo ? 'check' : 'block'" 
                :label="props.row.activo ? 'Activo' : 'Inactivo'"
                size="sm"
                @click="confirmarInactivar(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn 
                outline round color="warning" icon="edit" 
                @click="prepararEdicion(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn 
                outline round color="info" icon="visibility" 
                @click="verDetalles(props.row)"
              >
                <q-tooltip>Ver Detalles</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
    <q-card style="width: 900px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h4">{{ modoEdicion ? 'Editar Gage' : 'Nuevo Gage' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6"><q-input  filled :readonly="soloLectura" v-model="formModel.gageId" label="GageID" /></div>
            <div class="col-12 col-md-6"><q-input  filled :readonly="soloLectura" v-model="formModel.description" label="Nombre del Gage" /></div>
            <div class="col-12 col-md-6"><q-select filled :readonly="soloLectura" v-model="formModel.tipo" :options="opcionesTipo" label="Tipo" /></div>
            <div class="col-12 col-md-6"><q-select filled :readonly="soloLectura" v-model="formModel.estado" :options="opcionesEstado" label="Estado" /></div>
            <div class="col-12 col-md-6"><q-input  filled :readonly="soloLectura" v-model="formModel.localizacion" label="Localización" /></div>
            <div class="col-12 col-md-6"><q-input  filled :readonly="soloLectura" v-model="formModel.vendedor" label="Vendedor" /></div>
            
            <div class="col-12 col-md-6">
              <q-input filled :readonly="soloLectura" v-model="formModel.fechaCompra" mask="date" label="Fecha de Compra">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"><q-popup-proxy><q-date v-model="formModel.fechaCompra" /></q-popup-proxy></q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input filled :readonly="soloLectura" v-model="formModel.fechaProxima" mask="date" label="Próxima Calibración">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer"><q-popup-proxy><q-date v-model="formModel.fechaProxima" /></q-popup-proxy></q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12"><q-input filled :readonly="soloLectura" v-model="formModel.infoExtra" type="textarea" label="Información adicional" /></div>

            <div class="col-12 q-mt-lg">
              <q-btn v-if="!soloLectura" :label="modoEdicion ? 'Guardar Cambios' : 'Registrar'" type="submit" color="primary" />
              <q-btn :label="soloLectura ? 'Cerrar' : 'CANCELAR'" flat color="negative" v-close-popup class="q-ml-sm" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const index = () => router.push('/') // Redirige a la raíz

// --- ESTADOS DE CONTROL ---
const search = ref('')         // Para el buscador de la tabla
const Form = ref(false)         // Controla el diálogo de Agregar/Editar
const confirm = ref(false)      // Controla el diálogo de Inactivar
const modoEdicion = ref(false)  // Switch para saber si estamos editando o creando
const soloLectura = ref(false) // Controla si los inputs están bloqueados (para ver detalles)
const itemSeleccionado = ref(null) // Guarda el objeto que vamos a inactivar
const backdropFilter = ref('blur(4px)')

// --- MODELO ÚNICO PARA EL FORMULARIO ---
// En lugar de 10 variables sueltas, usamos un solo objeto. Es más limpio.
const formModel = ref({
  gageId: '',
  description: '',
  tipo: null,
  estado: null,
  localizacion: '',
  vendedor: '',
  fechaCompra: '',
  fechaProxima: '',
  infoExtra: '',
  activo: true
})

// --- CONFIGURACIÓN DE LA TABLA ---
const columns = [
  { name: 'gageId', label: 'GageID', field: 'gageId', align: 'left', sortable: true },
  { name: 'description', label: 'Nombre del Gage', field: 'description', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'activo', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

// Datos de prueba (Aquí llegarán los datos de tu base de datos después)
const rows = ref([
  { 
    gageId: 'NID-001', 
    description: 'Micrómetro Digital 0-25mm', 
    activo: true, 
    tipo: 'Digital',
    estado: 'Aprobado',
    localizacion: 'Lab A',
    vendedor: 'Mitutoyo',
    fechaCompra: '2024/01/01',
    fechaProxima: '2025/01/01',
    infoExtra: 'Calibración inicial ok'
  },
  { 
    gageId: 'NID-002', 
    description: 'Vernier Analógico', 
    activo: false, 
    tipo: 'Mecánico',
    estado: 'Rechazado'
  }
])

// --- FUNCIONES / MÉTODOS ---

// Prepara el formulario para un registro nuevo
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



// Abre el mini-diálogo de confirmación
const confirmarInactivar = (row) => {
  itemSeleccionado.value = row
  confirm.value = true
}

// Cambia el estado Activo/Inactivo
const toggleEstado = () => {
  if (itemSeleccionado.value) {
    itemSeleccionado.value.activo = !itemSeleccionado.value.activo
    // Aquí podrías hacer un update a tu base de datos en el futuro
  }
}

const onSubmit = () => {
  if (modoEdicion.value) {
    // Lógica para actualizar en la tabla (buscar por ID y reemplazar)
    const index = rows.value.findIndex(r => r.gageId === formModel.value.gageId)
    if (index !== -1) rows.value[index] = { ...formModel.value }
    alert('Gage actualizado con éxito')
  } else {
    // Lógica para agregar nuevo
    rows.value.push({ ...formModel.value, activo: true })
    alert('Gage registrado con éxito')
  }
  Form.value = false
}

const onReset = () => {
  formModel.value = {
    gageId: '',
    description: '',
    tipo: null,
    estado: null,
    localizacion: '',
    vendedor: '',
    fechaCompra: '',
    fechaProxima: '',
    infoExtra: ''
  }
}

// Opciones para los Selects
const opcionesEstado = ['Aprobado', 'Rechazado']
const opcionesTipo = ['Mecánico', 'Eléctrico', 'Digital']
</script>
