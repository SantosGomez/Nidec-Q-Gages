<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header class="bg-primary text-grey-9" height-hint="70" elevated>
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer " color="white" />

        <div class="row items-center cursor-pointer q-ml-md" @click="index">
          <img
            src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_White Version.png"
            alt="Nidec App Logo"
            style="height: 50px; object-fit: contain;"
          />
          <div class="column q-ml-md">
            <q-toolbar-title class="text-subtitle1 text-white text-weight-bolder line-height-1">
              MOTORES REYNOSA
            </q-toolbar-title>
            <div class="text-caption text-white text-weight-bold">Q-GAGE SYSTEM</div>
          </div>
        </div>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <q-btn
            v-if="authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'"
            flat round color="white" icon="settings" @click="user"
          />
          
          <q-separator vertical inset class="q-mx-sm" />

          <q-btn flat no-caps class="text-weight-bold user-btn" >
            <q-avatar size="32px" color="white" text-color="black" class="q-mr-sm">
              {{ authStore.usuario?.Usuario?.charAt(0).toUpperCase() }}
            </q-avatar>
            {{ authStore.usuario?.Usuario }}
            <q-icon name="expand_more" size="xs" class="q-ml-xs" />

            <q-menu transition-show="jump-down" transition-hide="jump-up" class="shadow-10">
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup @click="logout" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      side="left" 
      show-if-above
      bordered
      :width="280"
      class="bg-white"
      overlay
      elevated
      >
      <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <q-item-label header> Módulos Nidec Q-Gages </q-item-label>

        <q-item v-if="authStore.usuario?.ver_gage" clickable v-ripple @click="master">
          <q-item-section top avatar>
            <q-img src="src/assets/iconosGAGES/GageMaster.png" style="width: 100%; height: auto" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Gage Master</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="authStore.usuario?.ver_calibracion" clickable v-ripple @click="calibracion">
          <q-item-section top avatar>
            <q-img src="src/assets/iconosGAGES/calibracion.png" style="width: 100%; height: auto" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calibración</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="authStore.usuario?.ver_reportes" clickable v-ripple @click="reportes">
          <q-item-section top avatar>
            <q-img src="src/assets/iconosGAGES/reporte.png" style="width: 100%; height: auto" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reportes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="authStore.usuario?.ver_procedimientos"
          clickable
          v-ripple
          @click="procedimientos"
        >
          <q-item-section top avatar>
            <q-img
              src="src/assets/iconosGAGES/Procedimiento.png"
              style="width: 100%; height: auto"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Procedimientos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="checkout">
          <q-item-section top avatar>
            <q-img src="src/assets/iconosGAGES/registro.png" style="width: 100%; height: auto" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Gage Checkout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth' // Importamos

const router = useRouter()
const authStore = useAuthStore() // Usamos el store global
const leftDrawerOpen = ref(false)

const index = () => router.push('/')
const master = () => router.push('GageMaster')
const calibracion = () => router.push('calibracion')
const reportes = () => router.push('Reports')
const procedimientos = () => router.push('procedimientos')
const checkout = () => router.push('checkout')
const user = () => router.push('usuarios')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style lang="scss">
// Color institucional Nidec
.text-nidec-green {
  color: #009B4A !important;
}
.bg-nidec-green {
  background: #009B4A !important;
}

// Estilo del Menu Lateral
.menu-list {
  .q-item {
    border-radius: 0 24px 24px 0;
    margin-right: 12px;
    margin-bottom: 4px;
    color: #546e7a;
    
    &.menu-active {
      color: #009B4A;
      background: #e8f5e9;
      font-weight: bold;
      
      .q-icon {
        color: #009B4A;
      }
    }
  }
}

// Botón de usuario
.user-btn {
  border-radius: 8px;
  &:hover {
    background: #f5f5f5;
  }
}

// Ajustes de Toolbar
.line-height-1 {
  line-height: 1.2;
}

// Sincronización con el diseño de módulos
.q-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
