<template>
  <q-page class="bg-grey-2 flex flex-center q-pa-md">
    <div style="max-width: 1400px; width: 100%">

      <div class="text-center q-mb-xl">
        <div class="text-h3 text-weight-bolder text-primary">Nidec Q-GAGES</div>
        <div class="text-subtitle1 text-grey-7">Sistema de Control y Calibración de Instrumentos</div>
      </div>
      
      <div class="row q-col-gutter-lg justify-center">
        
        <div v-if="authStore.usuario?.ver_gage" class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Master" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/GageMaster.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow"
              />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                Gage Master
              </div>
            </q-card-section>
            <q-inner-loading :showing="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_calibracion" class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Calibracion" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/calibracion.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                Calibracion
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_reportes" class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Reportes" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/Reporte.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                Reportes
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.ver_procedimientos" class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Procedimientos" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/Procedimiento.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                Procedimientos
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Checkout" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/registro.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                PRESTAMO
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-if="authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'" class="col-12 col-sm-6 col-md-4">
          <q-card class="dashboard-card cursor-pointer text-center q-pa-md" @click="Usuario" v-ripple>
            <q-card-section class="flex flex-center">
              <img src="src/assets/iconosGAGES/usuario.png" 
                width="70px" 
                height="70px" 
                fit="contain"
                class="q-mb-sm icon-shadow" />
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="text-h6 text-uppercase text-weight-bold text-blue-grey-9">
                Usuarios
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>
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
<style scoped>
/* Efecto de elevación al pasar el mouse */
.dashboard-card {
  transition: all 0.3s ease;
  border-radius: 15px;
  border: 1px solid rgba(0,0,0,0.05);
}

.dashboard-card:hover {
  transform: translateY(-10px); /* Se eleva */
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
  background: white;
}

.icon-shadow {
  filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.1));
}

/* Para que los títulos no se vean pegados en móvil */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 2rem;
  }
}
</style>