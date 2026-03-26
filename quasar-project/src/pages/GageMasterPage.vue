<template>
    <q-btn label="Menú" color="primary" class="flex flex q-ma-md" @click="principal" />
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input filled v-model="name" label="Name" />
        
        <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
    </q-form>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function principal() {
    router.push('index')
}


</script>



