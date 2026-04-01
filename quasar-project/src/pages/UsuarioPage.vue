<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
  <div></div>
  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="width: 850px; margin: 0 auto; margin-top: 20px; padding: 20px">
      <h1>Usuarios</h1>
      <q-separator style="margin: 10px" />
      <div class="col-12 col-md-6">
        <q-input v-model="search" filled placeholder="BUSCAR">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <!-- <q-separator style="margin: 10px" /> -->
      <div class="col-12 col-md-6">
        <q-card-section>
          <q-list bordered>
            <q-item clickable v-ripple @click="UserInfo = true">
              <q-item-section avatar>
                <q-icon color="primary" name="account_circle" size="30px" />
              </q-item-section>
              <q-item-section>Nombre de usuario</q-item-section>
              <q-item-section>
                <label> Roll del usuario </label>
              </q-item-section>
              <q-dialog v-model="UserInfo" >
                <q-card style="min-width: 550px">
                    <q-card-section class="row items-center">
                      <q-icon name="account_circle" size="50px" color="primary" style="margin-right: 10px;" />
                      <h5>Nombre de usuario</h5>
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6" style="margin-bottom: 10px;">
                        Acceso para Editar:
                      </div> 
                      <q-checkbox v-model="EDIT_Gage" label="Gage Master" />
                      <q-checkbox v-model="EDIT_Calibracion" label="Calibracion" />
                      <q-checkbox v-model="EDIT_Reportes" label="Reportes" />
                      <q-checkbox v-model="EDIT_Procedimientos" label="Procedimientos" />
                    </q-card-section>
                    <q-card-section>
                      <div class="text-h6" style="margin-bottom: 10px;">
                        Acceso para Visualizar:
                      </div> 
                      <q-checkbox v-model="VER_Gage" label="Gage Master" />
                      <q-checkbox v-model="VER_Calibracion" label="Calibracion" />
                      <q-checkbox v-model="VER_Reportes" label="Reportes" />
                      <q-checkbox v-model="VER_Procedimientos" label="Procedimientos" />
                    </q-card-section>
                    
                    <q-card-actions align="right" style="margin-right: 10px; margin-bottom: 10px;">
                        <q-btn flat label="Cancelar" color="negative" v-close-popup />
                        <q-btn flat label="editar" color="primary" v-close-popup />
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


const EDIT_Gage = ref(false)
const EDIT_Calibracion = ref(false)
const EDIT_Reportes = ref(false)
const EDIT_Procedimientos = ref(false)
const VER_Gage = ref(false)
const VER_Calibracion = ref(false)
const VER_Reportes = ref(false)
const VER_Procedimientos = ref(false)

</script>
