<template>
  <q-page class="flex flex-center">
    <q-card class="my-card row q-col-gutter-md" style="max-width: 1000px; width: 100%; margin: auto; margin-top: 20px; padding: 20px;">
      <q-card-section class="flex flex-center col-12">
        <div class="text-h4">Bienvenido a Nidec Q-Gages</div>
      </q-card-section>
      
      <div class="row q-col-gutter-md full-width">
        
        <div v-if="authStore.usuario?.ver_gage" class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Master" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/GageMaster.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="Gage Master" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_calibracion" class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Calibracion" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/calibracion.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="Calibracion" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_reportes" class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Reportes" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/Reporte.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="Reportes" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_procedimientos" class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Procedimientos" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/Procedimiento.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="Procedimientos" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Checkout" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/registro.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="PRESTAMO" />
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'" class="col-12 col-sm-4">
          <q-card class="my-card cursor-pointer" @click="Usuario" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/usuario.png" style="width: 50px; height: auto" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn style="width: 100%" color="primary" label="Usuarios" />
            </q-card-section>
          </q-card>
        </div>

      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth' // 1. Importas el archivo que creaste
const router = useRouter()
const authStore = useAuthStore()

const Master = () => router.push('GageMaster')
const Calibracion = () => router.push('Calibracion')
const Reportes = () => router.push('Reports')
const Procedimientos = () => router.push('Procedimientos')
const Checkout = () => router.push('checkout')
const Usuario = () => router.push('Usuarios')



</script>
