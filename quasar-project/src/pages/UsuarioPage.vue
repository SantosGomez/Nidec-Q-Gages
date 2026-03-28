<template>
    <div style="margin: 20px ">
        <q-btn color="primary" icon="home" label="Inicio" @click="index" />
    </div>
    <div>
        <h1>Usuarios</h1>
    </div>
    <div class="q-pa-md flex flex-center" style="max-width: 400px">
        <q-card class="my-card">
            <q-card-section>
                <div class="text-h6">Our Changing Planet</div>
                <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
            <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}

</script>