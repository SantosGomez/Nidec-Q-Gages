<template>
  <div style="margin: 20px">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>

  <div class="row q-col-gutter-md" style="margin-top: 20px">
    <q-card class="my-card" style="max-width: 1450px; margin: 0 auto; margin-top: 20px">
      <q-card-section class="flex flex-center">
        <div class="text-h3" style="font-weight: bold">Gages</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h5" style="margin-bottom: 20px">
          Bienvenido al sistema de gestión de Gages. Seleccione una opción para comenzar.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              icon="add"
              style="font-size: 18px; width: 300px; height: 40px; margin-top: 5px"
              color="primary"
              label="Agregar Gage"
              @click="Form"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="search" filled placeholder="BUSCAR">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list bordered>
          <q-item>
            <q-item-section avatar>
              <div style="font-weight: bold; font-size: 18px">Id del Gage</div>
            </q-item-section>
            <q-item-section style="margin: 15px">Nombre del Gage</q-item-section>
            <q-item-section side>
              <q-btn size="17px" icon="edit" color="primary" label="Editar" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-model="current"
            :max="5"
            direction-links
            boundary-links
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'

const search = ref('')

function Form() {
  router.push('GageForm')
}

function index() {
  router.push('index')
}
</script>
