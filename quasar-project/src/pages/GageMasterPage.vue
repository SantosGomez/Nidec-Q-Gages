<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>

  <div class="row q-col-gutter-md flex flex-center" style="margin-top: 20px">
    <q-card class="my-card" style="width: 1250px; margin: 0 auto; margin-top: 20px">
      <q-card-section class="flex flex-center">
        <div class="text-h3" style="font-weight: bold">Gages</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h5" style="margin-bottom: 20px">
          Bienvenido al sistema de gestión de Gages. Seleccione una opción para comenzar.
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
              label="Agregar Gage"
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
      <q-separator />
      <q-card-section>
        <q-list bordered>
          <q-item v-for="(item, index) in 5" :key="index" style="margin-bottom: 5px;">
            <q-item-section avatar>
              <div style="font-weight: bold; font-size: 18px">Id del Gage</div>
            </q-item-section>
            <q-item-section style="margin: 15px">Nombre del Gage</q-item-section>
            
            <q-item-section style="font-size: 18px;">Estado
                <div class="col-6">
                  <q-btn  color="primary" icon="check" label="Activo" v-model="activo" @click="confirm = true" />
                </div>
                <q-dialog v-model="confirm" persistent>
                  <q-card>
                    <q-card-section class="row items-center">
                      <q-avatar icon="design_services" color="primary" text-color="white" />
                      <span class="q-ml-sm">¿Seguro que quieres continuar e inactivar el Gage?</span>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn flat label="Cancel" color="negative" v-close-popup />
                      <q-btn flat label="Continuar" color="primary" v-close-popup />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-item-section>
              
            <q-item-section side style="font-weight: bold; font-size: 18px;">
              Acciones
              <div class="col-6">
                <q-btn
                size="17px"
                icon="edit"
                color="warning"
                label="Editar"
                @click="editar = true"
                />
              </div>
              <q-dialog v-model="editar" persistent :backdrop-filter="backdropFilter">
                <q-card class="my-card" style="width: 1250px; margin: 0 auto;">
                  <q-card-section>
                    <div class="text-h4">Editar Gage</div>
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
                                <q-popup-proxy
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
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
                                <q-popup-proxy
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
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
                          <q-btn label="Editar" type="submit" color="warning"  />
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
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="current"
            :max="5"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'

const search = ref('')

const Form = ref(false)
const editar = ref(false)
const confirm = ref(false) 

function index() {
  router.push('index')
}

const gageId = ref('')
const description = ref('')
const tipoSeleccionado = ref(null) // Para el primer select
const estadoSeleccionado = ref(null) // Para el segundo select
const localizacion = ref('')
const vendedor = ref('')
const fechaCompra = ref('') // Fecha 1
const frecuencia = ref(null) // Para el tercer select
const fechaProxima = ref('') // Fecha 2
const calibracionTipo = ref(null) // Para el cuarto select
const infoExtra = ref('')
const activo = ref(true) // Para el estado del Gage
// --- OPCIONES DE LOS SELECTS ---
const opcionesEstado = ['Aprobado', 'Rechazado']
const opcionesTipo = ['Mecánico', 'Eléctrico', 'Digital']
const opcionesFrecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']
const opcionesCalibracion = ['Interna', 'Externa']

const current = ref(1) // Para la paginación
const list = ['blur(4px)', 'brightness(0.7)', 'contrast(1.2)']
const backdropFilter = ref(list[0])
</script>
