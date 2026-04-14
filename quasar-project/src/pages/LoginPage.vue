<template>
  <div class="flex flex-center">
    <q-card class="my-card" style="max-width: 600px; margin: 50px auto;">
      <div class="flex flex-center">
        <img
          style="width: 350px; height: auto"
          src="src/assets/ACIM Logo/PNG/Nidec Institutional Logo_Original Version.png"
        />
        <div
          class="text-h2"
          style="
            text-align: center;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 20px;
            font-weight: bold;
          "
        >
          Q-Gages
        </div>
      </div>
      <q-card-section>
        <div class="flex flex-center">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 text-h5" style="margin-top: 20px">
                Usuario
                <q-input v-model="form.usuario" placeholder="Nombre de usuario" />
              </div>
              <div class="col-12 text-h5" style="margin-top: 20px">
                Contraseña
                <q-input
                  v-model="form.password"
                  placeholder="Contraseña"
                  :type="isPwd ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="flex flex-center q-mt-md q-mb-md" style="margin-top: 40px; margin-bottom: 10px">
              <q-btn
                size="18px"
                style="width: 250px"
                label="Entrar"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar' // Opcional, para notificaciones bonitas
const $q = useQuasar()

import { useRouter } from 'vue-router'
const router = useRouter()

import { ref } from 'vue'
const form = ref({
  usuario: '',
  password: '',
})
const isPwd = ref(true)

import { api } from 'boot/axios'

const handleLogin = async () => {
  if (!form.value.usuario || !form.value.password) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, ingresa usuario y contraseña',
      position: 'top',
    })
    return
  }
  const dialog = $q.notify({
    group: false,
    timeout: 0,
    spinner: true,
    message: 'Validando credenciales...',
    color: 'primary',
  })

  try {
    const res = await api.post('/api/login', {
      usuario: form.value.usuario,
      password: form.value.password,
    })

    if (res.data.success) {
              // Quitamos el spinner y mostramos éxito
        dialog({
          type: 'positive',
          message: `¡Bienvenido al Q-GAGE, ${res.data.user.Usuario}!`,
          spinner: false,
          timeout: 2000,
        })
        // Guardamos al usuario en el almacenamiento local para que no se cierre la sesión al refrescar
        localStorage.setItem('token_qgage', res.data.token);
        localStorage.setItem('user_qgage', JSON.stringify(res.data.user));
        // Redirigir al dashboard o página principal
        router.push('/')
      
    }
  } catch (err) {
    // Quitamos el spinner y mostramos el error
    dialog({
      type: 'negative',
      message: err.response?.data?.message || 'Error de conexión con el servidor',
      spinner: false,
      timeout: 3000,
    })
  }
}

const onSubmit = () => {
  handleLogin() // Ejecutamos nuestra lógica de login al dar Enter
}

const onReset = () => {
  form.value.usuario = ''
  form.value.password = ''
}
</script>
