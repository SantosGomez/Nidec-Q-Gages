<template>
     <div style="margin: 20px ">
    <q-btn color="primary" icon="home" label="Inicio" @click="index" />
  </div>
    <div>
       <div class="text-h3">Procedimientos de calibración</div>
       

        <q-card class="my-card" style="max-width: 400px; margin: 0 auto; margin-top: 20px">
            <q-list bordered>
                <q-item>
                    <q-expansion-item
                      expand-separator
                      label="Procedimiento 1"
                      caption="John Doe"
                      icon="assignment"
                      style="margin: 10px;"
                    >
                      
                    <q-item-section>Proccedimient de Calibracion 1</q-item-section>
                    </q-expansion-item>
                </q-item>
            </q-list>
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