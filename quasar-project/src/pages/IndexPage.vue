<template>
  <q-page>
    <q-card rd class="my-card row q-col-gutter-md" style="max-width: 1200px; height: auto; margin: auto; margin-top: 20px;">
      <q-card-section class="flex flex-center">
        <div class="text-h4">Bienvenido a Nidec Q-Gages</div>
      </q-card-section>
     
    <div class="row q-col-gutter-md">
      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;" clickable v-ripple @click="Master">
          <q-card-section class="flex flex-center">
            <img
              src="src\assets\iconosGAGES\GageMaster.png"
              alt="Gage Master Icon"
              style="width: 50px; height: auto"
            />
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />
          <q-card-section class="flex flex-center">
            <q-btn style="width: 100%" color="primary" label="Gage Master" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;">
          <q-card-section class="flex flex-center">
            <img
              src="src\assets\iconosGAGES\calibracion.png"
              alt="calibracion Icon"
              style="width: 50px; height: auto"
            />
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Calibracion</div> -->
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />      
          <q-card-section>
            <q-btn style="width: 100%" color="primary" label="Calibracion" @click="Calibracion" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;">
          <q-card-section class="flex flex-center">
            <div class="flex flex-center">
              <img
                src="src\assets\iconosGAGES\Reporte.png"
                alt="reportes Icon"
                style="width: 50px; height: auto"
              />
            </div>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Reportes</div> -->
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />
          <q-card-section>
            <q-btn style="width: 100%" color="primary" label="Reportes" @click="Reportes" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;">
          <q-card-section class="flex flex-center">
            <img
              src="src\assets\iconosGAGES\Procedimiento.png"
              alt="procedimientos Icon"
              style="width: 50px; height: auto"
            />
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Procedimientos</div> -->
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />
          <q-card-section>
            <q-btn style="width: 100%" color="primary" label="Procedimientos" @click="Procedimientos"/>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;">
          <q-card-section class="flex flex-center">
            <img
              src="src\assets\iconosGAGES\registro.png"
              alt="Gage Checkout Icon"
              style="width: 50px; height: auto"
            />
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Procedimientos</div> -->
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />
          <q-card-section>
            <q-btn style="width: 100%" color="primary" label="Gage Checkout" @click="Checkout" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="my-card" style="max-width: 300px; height: auto;">
          <q-card-section class="flex flex-center">
            <img
              src="src\assets\iconosGAGES\usuario.png"
              alt="Usuarios Icon"
              style="width: 50px; height: auto"
            />
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Procedimientos</div> -->
          </q-card-section>
          <q-separator style="margin-left: 10px; margin-right: 10px;" />
          <q-card-section>
            <q-btn style="width: 100%" color="primary" label="Usuarios" @click="Checkout" />
          </q-card-section>
        </q-card>
      </div>

    </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function Master() {
  router.push('GageMaster')
}

function Calibracion() {
  router.push('Calibracion')
}
function Reportes() {
  router.push('Reportes')
}
function Procedimientos() {
  router.push('Procedimientos')
}
function Checkout() {
  router.push('Checkout')
}
</script>
