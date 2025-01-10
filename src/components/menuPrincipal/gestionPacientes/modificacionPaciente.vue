<script setup>
import exportedForm from '@/components/exportedForm.vue';
</script>

<template>

    <h1>Modificación de ficha de Pacientes</h1>
    
    <div class="modificar-paciente">
    
    <div>
      <label for="rut">Buscar por RUT:</label>
      <input v-model="rut" id="rut" type="text" placeholder="Ingrese RUT" />
      <button @click="buscarPaciente">Buscar</button>
    </div>

    <div v-if="paciente">
      <h3>Datos del Paciente</h3>
      <form @submit.prevent="actualizarPaciente">
        <div>
          <label for="nombre">Nombre:</label>
          <input v-model="paciente.nombre" id="nombre" type="text" />
        </div>
        <div>
          <label for="apellido_paterno">Apellido Paterno:</label>
          <input v-model="paciente.apellido_paterno" id="apellido_paterno" type="text" />
        </div>
        <div>
          <label for="apellido_materno">Apellido Materno:</label>
          <input v-model="paciente.apellido_materno" id="apellido_materno" type="text" />
        </div>
        <div>
          <label for="contacto">Contacto:</label>
          <input v-model="paciente.contacto" id="contacto" type="text" />
        </div>
        <div>
          <label for="correo">Correo:</label>
          <input v-model="paciente.correo" id="correo" type="email" />
        </div>
        <div>
          <label for="prevision">Previsión:</label>
          <input v-model="paciente.prevision" id="prevision" type="text" />
        </div>
        <button type="submit">Actualizar Paciente</button>
      </form>
    </div>

    <div v-else-if="mensaje">
      <p>{{ mensaje }}</p>
    </div>
  </div>

<exportedForm />
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rut: "",
      paciente: null,
      mensaje: "",
    };
  },
  methods: {
    async buscarPaciente() {
      try {
        const response = await axios.get(`http://localhost:5000/api/pacientes/${this.rut}`);
        this.paciente = response.data;
        this.mensaje = "";
      } catch (error) {
        this.paciente = null;
        this.mensaje = error.response?.data?.error || "Error al buscar el paciente";
      }
    },
    async actualizarPaciente() {
      try {
        const response = await axios.put(`http://localhost:5000/api/pacientes/${this.rut}`, this.paciente);
        alert("Paciente actualizado con éxito");
        this.paciente = response.data;
      } catch (error) {
        alert("Error al actualizar el paciente");
        console.error(error);
      }
    },
  },
};
</script>