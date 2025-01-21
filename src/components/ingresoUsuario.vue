<template>
  <form class="login-form" @submit.prevent="login">
    <h1>Ingreso Usuario</h1>
    <div>
      <label for="usuario">Usuario</label>
      <input type="text" id="usuario" v-model="usuario" required />
    </div>
    <div>
      <label for="password">Contraseña</label>
      <input type="password" id="password" v-model="password" required />
    </div>
    <button type="submit" :disabled="isLoading">{{ isLoading ? 'Cargando...' : 'Iniciar sesión' }}</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const usuario = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const login = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post('/api/validateUser', {
      usuario: usuario.value.toLowerCase(),
      password: password.value,
    });

    if (response.data.valid) {
      alert(response.data.message);
    } else {
      errorMessage.value = response.data.message || 'Error al iniciar sesión...';
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al iniciar sesión!!!';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto;
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form h1 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.login-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
}

.login-form input[type="text"]:focus,
.login-form input[type="password"]:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
}

.login-form button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.login-form button:hover {
  background-color: #0056b3;
}

.login-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-form .error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
