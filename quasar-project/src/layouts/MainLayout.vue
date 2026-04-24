<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <div class="row items-center cursor-pointer q-ml-md" @click="index">
          <img
            src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_White Version.png"
            alt="Nidec App Logo"
            style="height: 70px"
          />
          <q-toolbar-title class="q-ml-sm"> MOTORES REYNOSA </q-toolbar-title>
        </div>

        <q-space />

        <div class="q-pa-md">
          <q-btn color="white" flat label="Account Settings" icon="settings">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column flex flex-center">
                  <q-btn
                    v-if="
                      authStore.usuario?.Rol === 'Admin' || authStore.usuario?.Rol === 'SuperAdmin'
                    "
                    flat
                    color="primary"
                    label="Gestionar Usuarios"
                    @click="user"
                    icon="settings"
                  />
                  <q-btn
                    flat
                    color="negative"
                    label="Logout"
                    v-close-popup
                    @click="logout"
                    icon="logout"
                  />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="src\assets\iconosGAGES\usuario.png" />
                  </q-avatar>

                  <div v-if="authStore.usuario" class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ authStore.usuario?.Usuario }} ({{ authStore.usuario?.Rol }})
                  </div>
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay elevated>
      <q-list>
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
