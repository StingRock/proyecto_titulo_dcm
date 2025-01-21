<template>
  <div class="main-content">
    <h1>Modificación de ficha de Pacientes</h1>

    <div class="formulario">
      <!-- Campo para buscar por RUT -->
      <div class="form-group">
        <label for="rut_paciente">Buscar por RUT:</label>
        <br>
        <div class="rut-container">
          <input 
            v-model="rut_paciente" 
            id="rut_paciente" 
            type="text" 
            placeholder="Ingrese RUT" 
          />
          <label for="dv_paciente"> - </label>
          <input 
            v-model="dv_paciente" 
            id="dv_paciente" 
            type="text" 
            placeholder="DV" 
            readonly 
          />
        </div>
        <br>
        <button class="btn" @click="buscarPaciente">Buscar</button>
      </div>

      <!-- Mostrar formulario si se encuentra un paciente -->
      <div v-if="paciente">
        <h3>Datos del Paciente</h3>
        <form @submit.prevent="actualizarPaciente">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input 
              v-model="paciente.nombre" 
              id="nombre" 
              type="text" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="apellido_paterno">Apellido Paterno:</label>
            <input 
              v-model="paciente.apellido_paterno" 
              id="apellido_paterno" 
              type="text" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="apellido_materno">Apellido Materno:</label>
            <input 
              v-model="paciente.apellido_materno" 
              id="apellido_materno" 
              type="text" 
            />
          </div>
          <div class="form-group">
            <label for="contacto">Contacto:</label>
            <input 
              v-model="paciente.contacto" 
              id="contacto" 
              type="text" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="correo">Correo:</label>
            <input 
              v-model="paciente.correo" 
              id="correo" 
              type="email" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="prevision">Previsión:</label>
            <input 
              v-model="paciente.prevision" 
              id="prevision" 
              type="text" 
            />
          </div>
          <button class="btn" type="submit">Actualizar Paciente</button>
        </form>
      </div>

      <!-- Mensaje si no se encuentra paciente o hay un error -->
      <div v-else-if="mensaje" class="mensaje-error">
        <p>{{ mensaje }}</p>
      </div>
    </div>

    <exportedForm />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import exportedForm from "@/components/exportedForm.vue";
import axios from "axios";

const rut_paciente = ref("");
const dv_paciente = ref("");
const paciente = ref(null);
const mensaje = ref("");

// Función para calcular el dígito verificador
function calcularDigitoVerificador(rut) {
  if (!rut) return "";
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  return resto === 11 ? "0" : resto === 10 ? "K" : resto.toString();
}

watch(rut_paciente, (nuevoRut) => {
  const rutSinFormato = nuevoRut.replace(/\D/g, "");
  dv_paciente.value = calcularDigitoVerificador(rutSinFormato);
});

async function buscarPaciente() {
  try {
    const response = await axios.get(`http://localhost:5000/api/pacientes/${rut_paciente.value}`);
    paciente.value = response.data;
    mensaje.value = "";
  } catch (error) {
    paciente.value = null;
    mensaje.value = error.response?.data?.error || "Error al buscar el paciente";
  }
}

async function actualizarPaciente() {
  try {
    await axios.put(`http://localhost:5000/api/pacientes/${rut_paciente.value}`, paciente.value);
    alert("Paciente actualizado con éxito");
    limpiarCampos();
  } catch (error) {
    alert("Error al actualizar el paciente");
    console.error(error);
  }
}

function limpiarCampos() {
  rut_paciente.value = "";
  dv_paciente.value = "";
  paciente.value = null;
  mensaje.value = "";
}
</script>

<style scoped>
.main-content {
  max-width: 600px;
  margin: 20;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

h3 {
  margin-top: 20px;
  color: #555;
}

.formulario {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.rut-container {
  display: flex;
  align-items: center;
}

.rut-container input {
  margin-right: 5px;
  flex: 1;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.mensaje-error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>


