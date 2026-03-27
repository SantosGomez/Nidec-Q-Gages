<template>
  <div>
    <q-btn label="Volver" color="primary" class="q-ma-md" @click="back" icon="arrow_back" />
  </div>

  <q-card class="my-card" style="max-width: 1450px; margin: 0 auto; margin-top: 20px;">
    <q-card-section>
      <div class="text-h4">Gage Master</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="col-12 q-mb-md" style="">
            Activo / Inactivo
            <q-btn-toggle spread no-caps v-model="Activo" toggle-color="primary" :options="[{label: 'Activo', value: 'Activo'},{label: 'Inactivo', value: 'Inactivo'},]"/>
        </div>
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
            <q-select filled v-model="estadoSeleccionado" :options="opcionesEstado" label="Estado" />
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
            <q-select filled v-model="frecuencia" :options="opcionesFrecuencias" label="Frequencia de calibración" />
          </div>
          <div class="col-12 col-md-6">
            <q-select filled v-model="calibracionTipo" :options="opcionesCalibracion" label="Calibración Int/Ext." />
          </div>

          <div class="col-12">
            <q-input filled v-model="infoExtra" type="textarea" label="Información adicional" />
          </div>

          <div class="col-12 q-mt-lg">
            <q-btn label="REGISTRAR" type="submit" color="primary" />
            <q-btn label="CANCELAR" type="reset" color="negative" flat class="q-ml-sm" />
          </div>

        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Configuración del Router
const router = useRouter()

function back() {
  router.push('GageMaster')
}


const gageId = ref('')
const description = ref('')
const tipoSeleccionado = ref(null)    // Para el primer select
const estadoSeleccionado = ref(null)  // Para el segundo select
const localizacion = ref('')
const vendedor = ref('')
const fechaCompra = ref('')           // Fecha 1
const frecuencia = ref(null)          // Para el tercer select
const fechaProxima = ref('')          // Fecha 2
const calibracionTipo = ref(null)     // Para el cuarto select
const infoExtra = ref('')
const Activo = ref('Activo')          // Para el toggle Activo/Inactivo
// --- OPCIONES DE LOS SELECTS ---
const opcionesEstado = ['Aprobado', 'Rechazado']
const opcionesTipo = ['Mecánico', 'Eléctrico', 'Digital']
const opcionesFrecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']
const opcionesCalibracion = ['Interna', 'Externa']
</script>
