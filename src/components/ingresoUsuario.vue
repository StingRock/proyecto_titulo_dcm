<script setup>
import { ref } from 'vue';
import exportedForm from '@/components/exportedForm.vue';

const showForm = ref(false);

</script>

<template>
  <h1>Inicio de Sesión</h1>
  <button @click="showForm = true">Ingresar</button>
  <div v-if="showForm">
    <exportedForm />
  </div>
</template>