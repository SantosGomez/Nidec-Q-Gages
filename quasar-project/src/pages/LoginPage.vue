<template>
    <q-card class="my-card" style="max-width: 600px; margin: 0 auto; margin-top: 100px;">
        <div class="flex flex-center">
            <img style="width: 450px; height: auto;" src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_Original Version.png">
            <div class="text-h2" style="text-align: center; padding-left: 10px; padding-right: 10px; font-weight: bold;">
                Q-Gages
            </div>
        </div>
        <q-card-section>
            <div class="flex flex-center">

                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">                
                    <div class="q-pa-md q-gutter-md">
                        
                        <div class="text-h5" style="margin-top: 20px;">
                            Usuario 
                            <q-input filled v-model="ph" placeholder="Nombre de usuario"  :dense="dense"/>
                        </div>
                        <div class="text-h5" style="margin-top: 20px;">
                            Contraseña 
                            <q-input filled v-model="ph" placeholder="Contraseña"  :dense="dense"/>
                        </div>
                    </div>
                </q-form>
            </div>
            </q-card-section>
            <q-card-section class="flex flex-center">
                <q-btn label="Entrar" type="submit" color="primary" @click="inicio"/>
            </q-card-section>
    </q-card>
        
</template>

<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()

function inicio() {
    router.push('index')
}
</script>

