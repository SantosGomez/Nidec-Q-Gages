<template>
    <q-card class="my-card" style="max-width: 600px; margin: 0 auto; margin-top: 20px;">
        <div class="flex flex-center">
            <img style="width: 350px; height: auto;" src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_Original Version.png">
            <div class="text-h2" style="text-align: center; padding-left: 10px; padding-right: 10px; padding-bottom: 20px; font-weight: bold;">
                Q-Gages
            </div>
        </div>
        <q-card-section>
            <div class="flex flex-center">

                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">                
                    <div class="row q-col-gutter-md">
                        
                        <div class="col-12 text-h5" style="margin-top: 20px;">
                            Usuario 
                            <q-input filled v-model="ph" placeholder="Nombre de usuario"  :dense="dense"/>
                        </div>
                        <div class="col-12 text-h5" style="margin-top: 20px;">
                            Contraseña 
                            <q-input filled v-model="ph" placeholder="Contraseña"  :dense="dense"/>
                        </div>
                    </div>
                </q-form>
            </div>
            </q-card-section>
            <q-card-section class="flex flex-center q-mt-md q-mb-md">
                <div style="margin-bottom: 10px;">
                    <q-btn size="18px" style="width: 250px;" label="Entrar" type="submit" color="primary" @click="inicio"/>
                </div>
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

