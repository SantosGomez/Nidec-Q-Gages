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
    <q-card class="my-card" style="max-width: 1450px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h4">{{ modoEdicion ? 'Editar calibracion' : 'Nueva Calibracion' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input filled v-model="formModel.gageId" label="Gage ID" readonly />
            </div>
            <div class="col-12 col-md-8">
              <q-input filled v-model="formModel.description" label="Equipo" readonly />
            </div>

            <div class="col-12 col-md-6">
              <q-input filled v-model="formModel.folio" label="No. de Certificado / Folio" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="formModel.calibradoPor"
                label="Calibrado por (Externo/Técnico)"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                filled
                type="number"
                v-model="formModel.valorMedido"
                label="Valor Medido"
                suffix="mm"
              />
            </div>
            <div class="col-12 col-md-8">
              <div class="q-gutter-sm">
                <q-radio
                  v-model="formModel.estatusPasa"
                  :val="1"
                  label="PASA"
                  color="positive"
                  keep-color
                />
                <q-radio
                  v-model="formModel.estatusPasa"
                  :val="0"
                  label="FALLA"
                  color="negative"
                  keep-color
                />
              </div>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="formModel.fechaCalibracion"
                mask="date"
                label="Fecha de Calibración"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy><q-date v-model="formModel.fechaCalibracion" /></q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}

//para el dialog de procedimientos
import { ref } from 'vue'

const procedimientos = ref(false)
const Form = ref(false) // Controla el diálogo de Agregar/Editar
const modoEdicion = ref(false) // Switch para saber si estamos editando o creando
const soloLectura = ref(false) // Controla si los inputs están bloqueados (para ver detalles)
const text = ref('')
const search = ref('')
const backdropFilter = 'blur(5px)'

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
  activo: true,
})

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
    gageId: '',
    description: '',
    tipo: null,
    estado: null,
    localizacion: '',
    vendedor: '',
    fechaCompra: '',
    fechaProxima: '',
    infoExtra: '',
  }
}

const onSubmit = () => {
  if (modoEdicion.value) {
    // Lógica para actualizar en la tabla (buscar por ID y reemplazar)
    const index = rows.value.findIndex((r) => r.gageId === formModel.value.gageId)
    if (index !== -1) rows.value[index] = { ...formModel.value }
    alert('Gage actualizado con éxito')
  } else {
    // Lógica para agregar nuevo
    rows.value.push({ ...formModel.value, activo: true })
    alert('Gage registrado con éxito')
  }
  Form.value = false
}

const columns = [
  {
    name: 'IdGage',
    required: true,
    label: 'Gage ID',
    align: 'left',
    field: (row) => row.idGage,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'description',
    required: true,
    label: 'Descripción',
    align: 'left',
    field: (row) => row.description,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'tipo',
    required: true,
    label: 'Tipo',
    align: 'left',
    field: (row) => row.tipo,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Estado',
    required: true,
    label: 'Estado',
    align: 'left',
    field: (row) => row.Estado,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'fechaCalibraion',
    required: true,
    label: 'Fecha de Calibración actual',
    align: 'left',
    field: (row) => row.fechaCalibraion,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'fechaProxima',
    required: true,
    label: 'Próxima Calibración',
    align: 'left',
    field: (row) => row.fechaProxima,
    format: (val) => `${val}`,
    sortable: true,
  },

  { name: 'actions', label: 'Acciones', align: 'center' },
]
const rows = [
  {
    idGage: 'G001',
    description: 'Micrómetro Externo',
    tipo: 'Mecánico',
    Estado: 'Calibrado',
    fechaCalibraion: '2022-01-15',
    fechaProxima: '2023-01-15',
    frecuencia: 'Anual',
    calibracionTipo: 'Interna',
  },
  {
    idGage: 'G002',
    description: 'Calibrador Vernier',
    tipo: 'Mecánico',
    Estado: 'Pendiente de Calibración',
    fechaCalibraion: '2021-06-10',
    fechaProxima: '2022-06-10',
    frecuencia: 'Anual',
    calibracionTipo: 'Externa',
  },
  {
    idGage: 'G003',
    description: 'Micrómetro Interno',
    tipo: 'Mecánico',
    Estado: 'Calibrado',
    fechaCalibraion: '2020-11-05',
    fechaProxima: '2021-11-05',
    frecuencia: 'Anual',
    calibracionTipo: 'Interna',
  },
]

</script>
