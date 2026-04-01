<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div class="text-h2 flex flex-center" style="font-weight: bold">Calibracion De Gages</div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="width: 1250px; margin: 0 auto; margin-top: 20px">
      <q-card-section class="flex flex-center">
      
        <div class="text-h5" style="margin-bottom: 20px">
          Bienvenido al sistema de calibración de Gages. Seleccione una opción.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              icon="add"
              style="font-size: 18px; width: 300px; height: 40px; margin-top: 5px"
              color="primary"
              label="Calibrar Nuevo Gage"
              @click="Form = true"
            />
            <q-dialog v-model="Form" persistent :backdrop-filter="backdropFilter">
              <q-card class="my-card" style="width: 1450px">
                <q-card-section>
                  <div class="text-h4">Gage Master</div>
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
                        <q-select
                          filled
                          v-model="tipoSeleccionado"
                          :options="opcionesTipo"
                          label="Tipo"
                        />
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
                        <q-input
                          filled
                          v-model="fechaProxima"
                          mask="date"
                          label="Próxima Calibración"
                        >
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
                        <q-input
                          filled
                          v-model="infoExtra"
                          type="textarea"
                          label="Información adicional"
                        />
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
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="search" filled placeholder="BUSCAR">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}

// Variables para el formulario
import { ref } from 'vue'

const Form = ref(false)
</script>
