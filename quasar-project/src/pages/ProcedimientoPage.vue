<template>
  <div class="q-pa-md">
    <div class="q-mb-lg">
      <q-btn color="primary" icon="home" label="Inicio" @click="index" />
    </div>

    <div class="text-h4 q-mb-md text-center text-weight-bolder">Manuales De Procedimientos</div>
    <div class="col-12 col-md-6 flex flex-center" style="margin: 20px">
      <q-input
        v-model="search"
        filled
        placeholder="BUSCAR PROCEDIMIENTO"
        class="bg-white"
        style="width: 100%; max-width: 400px"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="row q-col-gutter-md justify-center">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="procedimiento in filteredProcedimientos"
        :key="procedimiento.ProceId"
      >
        <q-card class="my-card cursor-pointer q-hoverable" @click="abrirDetalle(procedimiento)">
          <span class="q-focus-helper"></span>
          <q-card-section class="text-center bg-primary text-white">
            <q-icon name="settings_input_component" size="4rem" />
            <div class="text-h6">{{ procedimiento.NombreProce }}</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat color="primary" label="Ver Procedimiento" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog
      v-model="procedimientoInfo"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1">
        <q-bar class="bg-primary text-white q-pa-lg">
          <q-icon name="description" />
          <div class="text-h6">{{ procedimientoSeleccionado?.NombreProce }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-scroll-area style="height: calc(100vh - 50px)">
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-8">
                <q-card flat bordered class="q-mb-md">
                  <q-card-section class="bg-blue-grey-1 text-weight-bold">
                    1.0 Propósito y 2.0 Alcance
                  </q-card-section>
                  <q-card-section>
                    <div class="text-weight-bold text-primary">Propósito:</div>
                    <p>{{ procedimientoSeleccionado?.Proposito }}</p>
                    <q-separator class="q-my-sm" />
                    <div class="text-weight-bold text-primary">Alcance:</div>
                    <p>{{ procedimientoSeleccionado?.Alcance }}</p>
                  </q-card-section>
                </q-card>

                <q-card flat bordered class="q-mb-md">
                  <q-card-section class="bg-blue-grey-1 text-weight-bold">
                    3.0 Materiales Requeridos
                  </q-card-section>
                  <q-card-section>
                    <div
                      v-html="procedimientoSeleccionado?.Materiales || 'Sin materiales registrados'"
                    ></div>
                  </q-card-section>
                </q-card>

                <q-card flat bordered>
                  <q-card-section class="bg-blue-grey-1 text-weight-bold">
                    6.0 Procedimiento y 7.0 Correcciones
                  </q-card-section>
                  <q-card-section>
                    <div v-html="procedimientoSeleccionado?.Instrucciones"></div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-md-4">
                <q-banner rounded class="bg-amber-1 text-amber-10 q-mb-md border-amber">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="amber-9" size="md" />
                  </template>
                  <div class="text-weight-bold">4.0 Precauciones:</div>
                  {{ procedimientoSeleccionado?.Precauciones }}
                </q-banner>

                <q-card dark class="bg-indigo-9 q-mb-md">
                  <q-card-section>
                    <div class="text-subtitle2">5.0 Tolerancia de Aceptación</div>
                    <div class="text-h5 text-weight-bolder">
                      {{ procedimientoSeleccionado?.Tolerancia }}
                    </div>
                  </q-card-section>
                </q-card>

                <div class="text-h6 q-mb-sm"><q-icon name="perm_media" /> Apoyo Visual</div>
                <q-img
                  v-if="procedimientoSeleccionado?.ImgProce"
                  :src="'http://tu-api-url/uploads/' + procedimientoSeleccionado.ImgProce"
                  class="rounded-borders shadow-2 q-mb-md"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-grey-8">
                      Sin imagen de apoyo
                    </div>
                  </template>
                </q-img>

                <q-btn
                  v-if="procedimientoSeleccionado?.ManualPDF"
                  color="red-9"
                  icon="picture_as_pdf"
                  label="Descargar Manual PDF"
                  class="full-width"
                  @click="descargarPDF(procedimientoSeleccionado.ManualPDF)"
                />
              </div>
            </div>
          </q-card-section>
        </q-scroll-area>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="nuevoProcedimiento()" />
    </q-page-sticky>
  </div>

  <q-dialog v-model="NuevoProcedimiento" persistent>
    <q-card style="width: 100%; max-width: 900px">
      <q-card-section class="row items-center bg-primary text-white">
        <q-icon size="md" name="import_contacts" color="white" />
        <span class="q-ml-md text-h6">Registro de Nuevo Procedimiento</span>
      </q-card-section>

      <q-stepper v-model="step" header-nav color="primary" animated flat>
        <q-step :name="1" title="General" icon="info" :done="step > 1">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Nombre del procedimiento</div>
              <q-input
                v-model="formProcedimiento.NombreProce"
                placeholder="Ejemplo: Calibración de Multímetro"
                outlined
              />
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Propósito General (1.0)</div>
              <q-input
                v-model="formProcedimiento.Proposito"
                type="textarea"
                placeholder="Ejemplo: Establecer los pasos para calibrar un multímetro digital de manera segura y precisa."
                outlined
                dense
              />
            </div>
          </div>
        </q-step>

        <q-step :name="2" title="Recursos" icon="build" :done="step > 2">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Alcance (2.0)</div>
              <q-input
                v-model="formProcedimiento.Alcance"
                type="textarea"
                placeholder="Ejemplo: Este procedimiento es aplicable para la calibración de multímetros digitales de la marca XYZ."
                outlined
                dense
                class="q-mb-md"
              />
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Materiales Requeridos (3.0)</div>
              <q-editor
                v-model="formProcedimiento.Materiales"
                min-height="5rem"
                :toolbar="[
                  ['left', 'center', 'right', 'justify'],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['unordered', 'ordered'], // <-- AQUÍ ESTÁN LAS VIÑETAS Y LISTAS NUMERADAS
                  ['undo', 'redo'],
                ]"
              />
            </div>
          </div>
        </q-step>

        <q-step :name="3" title="Criterios" icon="assignment_late" :done="step > 3">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Precauciones de Seguridad (4.0)</div>
              <q-input
                v-model="formProcedimiento.Precauciones"
                type="textarea"
                placeholder="Ejemplo: Use siempre guantes aislantes y gafas de seguridad durante la calibración."
                outlined
                dense
                color="amber-9"
              />
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Tolerancia de Aceptación (5.0)</div>
              <q-input
                v-model="formProcedimiento.Tolerancia"
                placeholder="Ejemplo: El multímetro debe mostrar una lectura dentro del ±0.5% del valor de referencia para ser considerado calibrado correctamente."
                outlined
              />
            </div>
          </div>
        </q-step>

        <q-step :name="4" title="Instrucciones" icon="play_circle_filled">
          <div class="text-subtitle2 q-mb-xs">Procedimiento y Correcciones (6.0 y 7.0)</div>
          <q-editor
            v-model="formProcedimiento.Instrucciones"
            min-height="10rem"
            :toolbar="[
              ['left', 'center', 'right', 'justify'],
              ['bold', 'italic', 'underline', 'strike'],
              ['unordered', 'ordered'], // <-- AQUÍ ESTÁN LAS VIÑETAS Y LISTAS NUMERADAS
              ['undo', 'redo'],
            ]"
          />

          <div class="q-mt-md">
            <q-file
              v-model="files"
              label="Seleccionar Imagen o PDF"
              outlined
              multiple
              append
              use-chips
              class="full-width"
            >
              <template v-slot:file="{ index, file }">
                <q-chip class="full-width q-my-xs" square removable @remove="removeFile(index)">
                  <q-avatar>
                    <q-icon :name="getFileIcon(file.type)" />
                  </q-avatar>

                  <div class="ellipsis relative-position">
                    {{ file.name }}
                  </div>

                  <q-tooltip>{{ file.name }}</q-tooltip>
                </q-chip>
              </template>

              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="row justify-end q-gutter-sm q-pa-md">
            <q-btn v-if="step > 1" flat color="primary" @click="step--" label="Atrás" />
            <q-btn
              v-if="step < 4"
              @click="step++"
              color="primary"
              label="Siguiente"
              :disable="!formProcedimiento.NombreProce"
            />
            <q-btn
              v-else
              color="positive"
              label="Guardar Procedimiento"
              @click="AgregarProcedimiento"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar y Salir" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// Estado reactivo para la búsqueda, el modal y el procedimiento de calibración actual
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')
const procedimientos = ref([])
const loading = ref(false)
const procedimientoSeleccionado = ref(null)
const procedimientoInfo = ref(false)
const NuevoProcedimiento = ref(false)
const files = ref(null)
const step = ref(1)

const formProcedimiento = ref({
  NombreProce: '',
  Proposito: '',
  Alcance: '',
  Materiales: '',
  Precauciones: '',
  Tolerancia: '',
  Instrucciones: '', // Para las secciones 6 y 7
})

const resetForm = () => {
  formProcedimiento.value = {
    NombreProce: '',
    Proposito: '',
    Alcance: '',
    Materiales: '',
    Precauciones: '',
    Tolerancia: '',
    Instrucciones: '',
  }
  files.value = null
  step.value = 1
}

//logica para el estado de subida de archivos

// Limpieza de memoria al cerrar el componente

// Filtro computado para mostrar solo los procedimientos que coinciden con la búsqueda
const filteredProcedimientos = computed(() => {
  if (!search.value) return procedimientos.value
  return procedimientos.value.filter((proc) =>
    proc.NombreProce.toLowerCase().includes(search.value.toLowerCase()),
  )
})

// API para obtener los procedimientos desde el backend
const obtenerProcedimientos = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/procedimientos')
    procedimientos.value = response.data
  } catch (error) {
    console.error('Error al obtener procedimientos:', error)
  } finally {
    loading.value = false
  }
}

const AgregarProcedimiento = async () => {
  try {
    // 1. Validaciones básicas
    if (!formProcedimiento.value.NombreProce) {
      $q.notify({ type: 'negative', message: 'El nombre es obligatorio' })
      return
    }

    // 2. Preparar el paquete de datos (OBJETO PURO PARA JSON)
    const datos = {
      NombreProce: formProcedimiento.value.NombreProce,
      Proposito: formProcedimiento.value.Proposito,
      Alcance: formProcedimiento.value.Alcance,
      Materiales: formProcedimiento.value.Materiales,
      Instrucciones: formProcedimiento.value.Instrucciones,
      Precauciones: formProcedimiento.value.Precauciones,
      Tolerancia: formProcedimiento.value.Tolerancia,
      ImgProce: null, // Por ahora nulos hasta que actives Multer
      ManualPDF: null,
    }

    // 3. Petición al Backend (Sin mezclar con FormData)
    const response = await api.post('/api/procedimientos', datos)

    // 4. Manejo de respuesta
    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Procedimiento guardado con éxito',
        icon: 'check',
      })

      NuevoProcedimiento.value = false
      obtenerProcedimientos()
      resetForm()
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al conectar con el servidor',
    })
  }
}

function abrirDetalle(procedimiento) {
  procedimientoSeleccionado.value = procedimiento
  procedimientoInfo.value = true
}
function nuevoProcedimiento() {
  NuevoProcedimiento.value = true
}

function getFileIcon(type) {
  if (type.indexOf('image/') === 0) return 'photo'
  if (type.indexOf('application/pdf') === 0) return 'picture_as_pdf'
  return 'insert_drive_file'
}

function removeFile(index) {
  files.value.splice(index, 1)
}

// Navegación a la página de inicio
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}

const descargarPDF = (url) => {
  window.open(`http://tu-api-url/uploads/${url}`, '_blank')
}

onMounted(() => {
  obtenerProcedimientos()
})
</script>
