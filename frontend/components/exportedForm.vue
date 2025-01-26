<template>
    <div class="layout">
      <nav class="topbar">
        <h2>Menú Principal</h2>
        <ul>
          <li>
            <router-link to="/gestionPacientes">Gestión de Pacientes</router-link>
          </li>
          <li>
            <router-link to="/creacionPaciente">Creación de Pacientes</router-link>
          </li>
          <li v-if="userType === '1'">
            <router-link to="/modificacionPaciente">Modificación de Ficha de Pacientes</router-link>
          </li>
          <li>
            <router-link to="/gestionDcm">Gestión de Detalle de Cuenta Médica</router-link>
          </li>
          <li>
            <router-link to="/creacionDcm">Creación de Detalle de Cuenta Médica</router-link>
          </li>
          <li>
            <router-link to="/listadoRegistroDcm">Listado de Detalles de Cuenta Médica</router-link>
          </li>
          <br>
          <br>
          <br>
          <li>
            <a href="#" @click.prevent="goToHome">Cerrar sesión</a>
          </li>
        </ul>
      </nav>
  
      <!-- Contenido principal -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userType = ref(null);

onMounted(() => {
  userType.value = localStorage.getItem('userType');
});

function goToHome() {
  localStorage.removeItem('userType');
    router.push('/');
}
</script>

<style>

.layout {
  display: flex;
  height: 100vh;
}

.topbar {
  background-color: #c4d5f3;
  color: rgb(0, 0, 0);
  width: 250px;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.topbar h2 {
  margin: 0;
  padding-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.topbar ul {
  list-style-type: none;
  padding: 0;
}

.topbar ul li {
  margin-bottom: 10px;
}

.topbar ul li a,
.topbar ul li router-link {
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 18px;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.topbar ul li a:hover,
.topbar ul li router-link:hover {
  background-color: #676666;
}

.main-content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
  box-sizing: border-box;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .topbar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
    margin-top: 20px;
  }
}

.topbar {
  display: flex;
  flex-direction: column;
}

.topbar ul {
  flex: 1;
  display: flex;
  flex-direction: column;
}

li:last-child {
  margin-top: auto;
}

</style>