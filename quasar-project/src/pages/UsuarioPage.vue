<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div></div>
  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="width: 950px; margin: 0 auto; margin-top: 20px; padding: 20px">
      <h1>Usuarios</h1>
      <q-separator style="margin: 10px" />
      <div class="col-12 col-md-6">
        <q-input v-model="search" filled placeholder="BUSCAR">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-separator style="margin: 10px" />
      <div class="col-12 col-md-6">
        <q-card-section>
          <q-list bordered>
            <q-item clickable v-ripple v-for="(item, index) in 5" :key="index" @click="UserInfo = true">
              <q-item-section avatar>
                <q-icon color="primary" name="account_circle" size="30px" />
              </q-item-section>
              <q-item-section>Nombre de usuario</q-item-section>
              <q-item-section>
                <label> Roll del usuario </label>
              </q-item-section>
              <q-dialog v-model="UserInfo" >
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                        <span class="q-ml-sm">You are currently not connected to any network.</span>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="primary" v-close-popup />
                        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}

import { ref } from 'vue'
const UserInfo = ref('false')

</script>
