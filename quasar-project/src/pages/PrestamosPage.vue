<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h3 flex flex-center" style="font-weight: bold; margin: 10px;">Préstamos</div>
  <q-card class="my-card" style="width: 800px; margin: 0 auto; margin-top: 20px">
    <q-card-section>
      <div>
        <q-btn label="Nuevo registro" icon="add" color="primary" @click="Form = true" />
        <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
          <q-card style="min-width: 450px">
            <div class="row">
              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">Nombre</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input filled dense v-model="Nombre" autofocus @keyup.enter="prompt = false" />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">No. Empleado</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input
                    filled
                    dense
                    v-model="NumEmpleado"
                    autofocus
                    @keyup.enter="prompt = false"
                  />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">Turno</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input filled dense v-model="Turno" autofocus @keyup.enter="prompt = false" />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">Gage</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input filled dense v-model="Gage" autofocus @keyup.enter="prompt = false" />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">Area</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input filled dense v-model="Area" autofocus @keyup.enter="prompt = false" />
                </q-card-section>
              </div>

              <div class="col-6">
                <q-card-section>
                  <div class="text-h6">Hora de prestamo</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input
                    filled
                    dense
                    v-model="HoraPrestamo"
                    type="time"
                    autofocus
                    @keyup.enter="prompt = false"
                  />
                </q-card-section>
              </div>
            </div>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Agregar Prestamo" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="text-h6">Historial de prestamos</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const Form = ref(false)
const Nombre = ref('')
const NumEmpleado = ref('')
const Turno = ref('')
const Gage = ref('')
const Area = ref('')
const HoraPrestamo = ref('')

function index() {
  router.push('/')
}

const list = ['blur(4px)', 'brightness(0.7)', 'contrast(1.2)']
const backdropFilter = ref(list[0])
</script>
