<template>
  <div class="q-pa-md">
    <div class="q-mb-lg">
      <q-btn color="primary" icon="home" label="Inicio" @click="index" />
    </div>

    <div class="text-h4 q-mb-md text-center text-weight-bolder">Manuales De Procedimientos</div>
    <div class="col-12 col-md-6 flex flex-center" style="margin: 20px; ">
            <q-input v-model="search" filled placeholder="BUSCAR" class="bg-white" style="width: 100%; max-width: 400px;">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
    </div>
    <div class="row q-col-gutter-md justify-center">
      
      <div class="col-12 col-sm-6 col-md-4">
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

      </div>

    <q-dialog v-model="modalOpen" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white q-pa-lg">
          <div class="text-h6">{{ currentManual.title }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-h5 q-mb-sm">Instrucciones de Calibración</div>
              <p class="text-body1">{{ currentManual.description }}</p>
              
              <q-banner rounded class="bg-amber-1 q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="warning" color="amber-9" />
                </template>
                Asegúrese de desconectar la fuente de poder antes de iniciar.
              </q-banner>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-h5 q-mb-sm">Apoyo Visual</div>
              <q-img 
                :src="currentManual.image" 
                class="rounded-borders shadow-2"
                style="max-height: 300px"
              />
              <q-btn 
                color="red-9" 
                icon="picture_as_pdf" 
                label="Abrir Manual PDF Completo" 
                class="full-width q-mt-md"
                @click="viewPDF(currentManual.pdfUrl)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
// Estado reactivo para la búsqueda, el modal y el procedimiento de calibración actual
import { ref } from 'vue'

const search = ref('')
const modalOpen = ref(false)
const currentManual = ref({})

// Datos de ejemplo (Esto podría venir de una API)
const manuales = {
  motor: {
    title: 'Procedimiento de Motor/Rotor-SHAFT',
    description: 'Este procedimiento detalla los pasos para la alineación del eje...',
    image: 'https://cdn.quasar.dev/img/parallax2.jpg',
    pdfUrl: '/manuales/motor.pdf'
  }
}

function openManual(key) {
  currentManual.value = manuales[key]
  modalOpen.value = true
}

function viewPDF(url) {
  window.open(url, '_blank')
} 

// Navegación a la página de inicio
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}
</script>
