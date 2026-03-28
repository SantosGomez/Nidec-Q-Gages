<template>
     <div style="margin: 20px ">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
    <div class="text-h3 " style="font-weight: bold; margin: 10px;">Préstamos</div>
    <q-card class="my-card" style="max-width: 400px; margin: 0 auto; margin-top: 20px">        
        <q-card-section>    
            <div>
                <q-list bordered>
                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon color="primary" name="add" />
                        </q-item-section>
                        <q-item-section>Agregar nuevo préstamo</q-item-section>
                    </q-item>
                </q-list>
            </div>
    </q-card-section>
        <q-separator />
        <q-card-section>
            <div class="text-h6">Historial de prestamos</div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function index() {
  router.push('index')
}
</script>