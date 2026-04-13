<template>
  <div class="flex flex-center">
  <q-card class="my-card" style="max-width: 600px; margin: 0 auto; margin-top: 20px">
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
              <q-input filled v-model="username" placeholder="Nombre de usuario" />
            </div>
            <div class="col-12 text-h5" style="margin-top: 20px">
              Contraseña
              <q-input
                v-model="password"
                filled
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
        </q-form>
      </div>
    </q-card-section>
    <q-card-section class="flex flex-center q-mt-md q-mb-md">
      <div style="margin-bottom: 10px">
        <q-btn
          size="18px"
          style="width: 250px"
          label="Entrar"
          type="submit"
          color="primary"
          @click="inicio"
        />
      </div>
    </q-card-section>
  </q-card>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function inicio() {
  router.push('/')
}

import { ref } from 'vue'
const username = ref('')
const password = ref('')
const isPwd = ref(true)


const handleLogin = async () => {
  try {
    const res = await api.post('/api/login', {
      usuario: form.usuario,
      password: form.password
    });

    if (res.data.success) {
      // Guardamos al usuario en el almacenamiento local para que no se cierre la sesión al refrescar
      localStorage.setItem('user_qgage', JSON.stringify(res.data.user));
      
      // Redirigir al dashboard o página principal
      router.push('/dashboard');
    }
  } catch (err) {
    alert(err.response?.data?.message || "Error al conectar");
  }
};
</script>
