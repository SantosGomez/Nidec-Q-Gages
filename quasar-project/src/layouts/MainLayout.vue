<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
  <q-toolbar>
    <q-btn 
      flat 
      dense 
      round 
      icon="menu" 
      aria-label="Menu" 
      @click="toggleLeftDrawer" 
    />

    <div class="row items-center cursor-pointer q-ml-md" @click="index">
      <img 
        src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_White Version.png" 
        alt="Nidec App Logo" 
        style="height: 70px;" 
      />
      <q-toolbar-title class="q-ml-sm">
        MOTORES REYNOSA
      </q-toolbar-title>
    </div>

    <q-space />

  <div class="q-pa-md">
    <q-btn color="white" flat label="Account Settings" icon="settings">
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column flex flex-center">
            <q-btn flat color="primary" label="Configuraciones" v-close-popup @click="user" icon="settings" />
            <q-btn flat color="negative" label="Logout" v-close-popup @click="login" icon="logout"/>
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="src\assets\iconosGAGES\usuario.png" />
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">Usuario</div>

            
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
  </q-toolbar>
</q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <q-list>
        <q-item-label header> Modulos Nidec Q-Gages </q-item-label>
        <!-- <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" /> -->
       
          <q-item clickable v-ripple @click="master">
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\GageMaster.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Gage Master</q-item-label>
            </q-item-section>          
          </q-item>
        

        
          <q-item clickable v-ripple @click="calibracion">
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\calibracion.png" alt="Calibracion Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Calibracion</q-item-label>
            </q-item-section>          
          </q-item>

        
          <q-item clickable v-ripple @click="reportes">
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\reporte.png" alt="Reportes Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Reportes</q-item-label>
            </q-item-section>          
          </q-item>

          <q-item clickable v-ripple @click="procedimientos">
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\Procedimiento.png" alt="Procedimientos Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Procedimientos</q-item-label>
            </q-item-section>          
          </q-item>
       
          <q-item clickable v-ripple @click="checkout">
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\registro.png" alt="Gage Checkout Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Gage Checkout</q-item-label>
            </q-item-section>          
          </q-item>
        
        


      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('/')
}

function login() {
  router.push({ name: 'login' })
}
function master() {
  router.push('GageMaster')
}

function calibracion() {
  router.push('calibracion')
}

function reportes() {
  router.push('Reports')
}

function procedimientos() {
  router.push('procedimientos')
}
function checkout() {
  router.push('checkout')
}

function user() {
  router.push('usuarios')
}
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
