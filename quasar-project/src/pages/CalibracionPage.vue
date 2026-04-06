<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h2 flex flex-center" style="font-weight: bold">Calibracion De Gages</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <div class="col-12 col-md-12">
      <q-card class="my-card" style="max-width: 1250px; margin: 0 auto; margin-top: 20px">
        <q-card-section>
          <div class="text-h5">
            Bienvenido al sistema de calibración de Gages. Seleccione una opción.
          </div>
        </q-card-section>
        <q-separator  />
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
                @click="Form = true"
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
          <q-table :rows="rows" :columns="columns" row-key="idGage" flat bordered>

            <template v-slot:top-right>
          <q-input v-model="search" dense debounce="300" placeholder="Buscar Gage">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- dialog de formulario para calibracion de gages -->
  <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
    <q-card class="my-card" style="width: 1450px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h4">Calibración Nueva de Gage</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input filled v-model="gageId" label="GageID" />
            </div>
            <div class="col-12 col-md-6">
              <q-input filled v-model="description" label="Nombre del Gage" />
            </div>

            <div class="col-12 col-md-6">
              <q-select filled v-model="tipoSeleccionado" :options="opcionesTipo" label="Tipo" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="estadoSeleccionado"
                :options="opcionesEstado"
                label="Estado"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input filled v-model="localizacion" label="Localización" />
            </div>
            <div class="col-12 col-md-6">
              <q-input filled v-model="vendedor" label="Vendedor" />
            </div>

            <div class="col-12 col-md-6">
              <q-input filled v-model="fechaCompra" mask="date" label="Fecha de Compra">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="fechaCompra">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input filled v-model="fechaProxima" mask="date" label="Próxima Calibración">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="fechaProxima">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="frecuencia"
                :options="opcionesFrecuencias"
                label="Frequencia de calibración"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="calibracionTipo"
                :options="opcionesCalibracion"
                label="Calibración Int/Ext."
              />
            </div>

            <div class="col-12">
              <q-input filled v-model="infoExtra" type="textarea" label="Información adicional" />
            </div>

            <div class="col-12 q-mt-lg">
              <q-btn label="REGISTRAR" type="submit" color="primary" />
              <q-btn
                label="CANCELAR"
                type="reset"
                color="negative"
                flat
                class="q-ml-sm"
                v-close-popup
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- dialog de procedimientos de calibracion -->
  <q-dialog v-model="procedimientos">
    <q-card style="min-width: 900px">
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
const Form = ref(false)
const text = ref('')

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
  {
    name: 'frecuencia',
    required: true,
    label: 'Frecuencia de Calibración',
    align: 'left',
    field: (row) => row.frecuencia,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'calibracionTipo',
    required: true,
    label: 'Calibración Int/Ext.',
    align: 'left',
    field: (row) => row.calibracionTipo,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Editar',
    required: true,
    label: 'Editar',
    align: 'left',
    field: (row) => row.Editar,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'ver',
    required: true,
    label: 'Ver Detalles',
    align: 'left',
    field: (row) => row.ver,
    format: (val) => `${val}`,
    sortable: true,
  },
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
    Editar: 'Editar',
    ver: 'Ver Detalles',
    
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
    Editar: 'Editar',
    ver: 'Ver Detalles',

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
    Editar: 'Editar',
    ver: 'Ver Detalles',
  },
]
</script>
