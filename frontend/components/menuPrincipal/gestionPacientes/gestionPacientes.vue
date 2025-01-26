<script setup>
import exportedForm from '@/components/exportedForm.vue';
</script>

<template>
<div class="formulario-gestion-paciente">
  <h1>Gestión de Pacientes</h1>
  <exportedForm />
</div>
</template>

<style scoped>
.formulario-gestion-paciente {
 background-color: #f8f9fa;
 padding: 20px;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
 text-align: center;
 font-size: 30px;
 margin-bottom: 30px;
 color: #333;
}
</style>