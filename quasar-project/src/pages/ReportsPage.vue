<template>
  <div style="margin: 12px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="q-pa-md">
    <q-card style="padding: 10px; max-width: 900px; margin: 0 auto;">
      <h4 style="margin: 10px">Reportes</h4>
      <q-card-section>
        <div class="text-h6">Selecciona el tipo de reporte:</div>
        <div class="row">
          <!--Selector para tipos de reporte-->
          <div class="col-12">
            <q-select clearable v-model="opciones" :options="list" label="Seleccionar reporte" />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <div class="row items-right q-ml-md" style="margin-top: 10px;">
                <q-btn round color="primary" label="?"  flat>
                    <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" transition-show="scale" transition-hide="scale">
                        <div class="text-left">
                            <p><strong>Fecha de inicio:</strong> Selecciona la fecha de inicio para el reporte.</p>
                            <p><strong>Fecha de fin:</strong> Selecciona la fecha de fin para el reporte.</p>
                            <p><strong>GageID:</strong> Ingresa el ID del gage para filtrar el reporte por ese gage específico. Si se deja en blanco, se incluirán todos los gages.</p>
                            <p>* Dejar en blanco para seleccionar todo</p>
                        </div>
                    </q-tooltip>
                </q-btn> 
            </div>
      <!-- Formulario para ingresar fechas y GageID -->
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row">
                <div class="col-3 q-ml-md">
                    Fecha de inicio
                    <q-input filled v-model="fechaInicio" mask="date" placeholder="YYYY/MM/DD">
                    <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fechaInicio">
                            <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                        </q-date>
                        </q-popup-proxy>
                    </q-icon>
                    </template>
                </q-input>
                </div>
                <div class="col-3 q-ml-md">
                    Fecha de Fin
                    <q-input filled v-model="fechaFin" mask="date" placeholder="YYYY/MM/DD">
                    <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fechaFin">
                            <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                        </q-date>
                        </q-popup-proxy>
                    </q-icon>
                    </template>
                </q-input>
                </div>
                <div class="col-3 q-ml-md">
                    GageID
                    <q-input filled v-model="gageId" label="GageID" />
                </div>
            </div>
            

            <div style="padding: 10px;">
                <q-btn label="Imprimir" type="submit" color="primary" />
                <q-btn label="Pre-visualizar" type="reset" color="secondary" icon="preview" flat class="q-ml-sm" />
            </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Variable para almacenar la opción seleccionada
const opciones = ref(null)
// Lista de opciones para el selector de tipos de reporte
const list = [
  { label: 'Calibraciones Pendiente', value: 'Pendientes' },
  { label: 'Calibraciones Pendiente Con Procedimiento', value: 'PendientesConProcedimiento' },
  { label: 'Calibraciones Pendiente Con Estandares', value: 'PendientesConEstandares' },
  { label: 'Calibraciones Pendiente Por Mes', value: 'PendientesPorMes' },
  { label: 'Historial de Calibraciones', value: 'Historial' },
]

//variables donde se almacena la informacion
const fechaInicio = ref('')
const fechaFin = ref('')
const gageId = ref('')


import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}
</script>
