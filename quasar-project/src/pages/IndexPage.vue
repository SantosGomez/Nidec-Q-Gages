<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">       

        <q-card class="my-card">
          <q-card-section class="flex flex-center">
            <img src="src\assets\iconosGAGES\GageMaster.png" alt="Gage Master Icon" style="width: 15%; height: auto;"/>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Gage Master</div> -->
          </q-card-section>
          <q-card-section>
            <q-btn style="width: 100%;" color="primary"  label="Gage Master" @click="Master" />
          </q-card-section>
        </q-card>
        
        <q-card class="my-card">
          <q-card-section class="flex flex-center">
            <img src="src\assets\iconosGAGES\calibracion.png" alt="calibracion Icon" style="width: 15%; height: auto;"/>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Calibracion</div> -->
          </q-card-section>
          <q-card-section>
            <q-btn style="width: 100%;" color="primary"  label="Calibracion" @click="Calibracion" />
          </q-card-section>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="flex flex-center"  >
            <div class="flex flex-center">
              <img src="src\assets\iconosGAGES\Reporte.png" alt="reportes Icon" style="width: 15%; height: auto;"/>
            </div>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Reportes</div> -->
          </q-card-section>
          <q-card-section>
            <q-btn style="width: 100%;" color="primary"  label="Reportes" @click="Reportes" />
          </q-card-section>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="flex flex-center"  >
            <img src="src\assets\iconosGAGES\Procedimiento.png" alt="procedimientos Icon" style="width: 15%; height: auto;"/>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Procedimientos</div> -->
          </q-card-section>
          <q-card-section>
            <q-btn style="width: 100%;" color="primary"  label="Procedimientos" @click="Procedimientos" />
          </q-card-section>
        </q-card>

        <q-card class="my-card">
          <q-card-section class="flex flex-center"  >
            <img src="src\assets\iconosGAGES\registro.png" alt="Gage Checkout Icon" style="width: 15%; height: auto;"/>
            <!-- <div class="text-h6" style="text-align: center; padding-left: 10px; padding-right: 10px;">Procedimientos</div> -->
          </q-card-section>
          <q-card-section>
            <q-btn style="width: 100%;" color="primary"  label="Gage Checkout" @click="Checkout" />
          </q-card-section>
        </q-card>


      </div>  
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
