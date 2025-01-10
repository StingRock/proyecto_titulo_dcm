<script setup>
import exportedForm from '@/components/exportedForm.vue';
</script>

<template>

    <h1>Creación de Pacientes</h1>

    <div>
    <form @submit.prevent="crearPaciente">
      <div>
        <label for="rut_paciente">RUT:</label>
        <input id="rut_paciente" v-model="paciente.rut_paciente" required />
      </div>
      <div>
        <label for="nombre">Nombre:</label>
        <input id="nombre" v-model="paciente.nombre" required />
      </div>
      <div>
        <label for="apellido_paterno">Apellido Paterno:</label>
        <input id="apellido_paterno" v-model="paciente.apellido_paterno" required />
      </div>
      <div>
        <label for="apellido_materno">Apellido Materno:</label>
        <input id="apellido_materno" v-model="paciente.apellido_materno" />
      </div>
      <div>
        <label for="contacto">Contacto:</label>
        <input id="contacto" v-model="paciente.contacto" type="tel" required />
      </div>
      <div>
        <label for="correo">Correo:</label>
        <input id="correo" v-model="paciente.correo" type="email" required />
      </div>
      <div>
        <label for="prevision">Previsión:</label>
        <input id="prevision" v-model="paciente.prevision" />
      </div>
      <button type="submit">Guardar</button>
    </form>
  </div>

<exportedForm />
</template>

<script>
export default {
  data() {
    return {
      paciente: {
        rut_paciente: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        contacto: '',
        correo: '',
        prevision: '',
      },
    };
  },
  methods: {
    async crearPaciente() {
      try {
        await fetch('http://localhost:3000/api/pacientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.paciente),
        });
        this.$router.push('/'); //Redirige a Gestion de pacientes.-
      } catch (error) {
        console.error('Error al crear el paciente:', error);
      }
    },
  },
};
</script>