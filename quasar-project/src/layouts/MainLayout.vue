<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img src="src\assets\ACIM Logo\PNG\Nidec Institutional Logo_White Version.png" alt="Nidec App Logo" style="height: 60px; margin-right: 10px; margin-left: 10px;" />
        <q-toolbar-title>MOTORES REYNOSA</q-toolbar-title>
        <q-toolbar-section>
          <q-item clickable v-ripple class="q-pa-none" @click="login">            
            <q-item-section>
              <q-item-label style="font-size: 18px; padding-left: 10px;">Nombre Usuario</q-item-label>              
            </q-item-section>
            <q-item-section side top>
              <q-avatar size="80px" font-size="60px" text-color="white" icon="account_circle" />              
            </q-item-section>
          </q-item>
        </q-toolbar-section>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Modulos Nidec Q-Gages </q-item-label>
        <!-- <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" /> -->
       <router-link to="index">
          <q-item clickable v-ripple>
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\GageMaster.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Gage Master</q-item-label>
            </q-item-section>          
          </q-item>
        </router-link>

        <router-link to="calibracion">
          <q-item clickable v-ripple>
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\calibracion.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Calibracion</q-item-label>
            </q-item-section>          
          </q-item>
        </router-link>

        
        <router-link to="reporte">
          <q-item clickable v-ripple>
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\reporte.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Reportes</q-item-label>
            </q-item-section>          
          </q-item>
        </router-link>

        <router-link to="procedimientos">
          <q-item clickable v-ripple>
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\Procedimiento.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Procedimientos</q-item-label>
            </q-item-section>          
          </q-item>
        </router-link>

        <router-link to="checout">          
          <q-item clickable v-ripple>
            <q-item-section top avatar>
              <q-img src="src\assets\iconosGAGES\registro.png" alt="Gage Master Icon" style="width: 100%; height: auto;"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Gage Checkout</q-item-label>
            </q-item-section>          
          </q-item>
        </router-link>
        
        


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

function login() {
  router.push('login')
}

import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
