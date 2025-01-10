<script setup>
import exportedForm from '@/components/exportedForm.vue';
</script>

<template>

    <h1>Creación de Detalle de Cuenta Medica</h1>
    <div class="crear-dcm">
    <form @submit.prevent="crearDcm">
      <div>
        <label for="descripcion">Descripción:</label>
        <input v-model="descripcion" id="descripcion" type="text" required />
      </div>

      <div>
        <label for="prestaciones">Prestaciones:</label>
        <select v-model="prestacionSeleccionada" id="prestaciones">
          <option v-for="prestacion in prestaciones" :key="prestacion.codigo_prestacion" :value="prestacion">
            {{ prestacion.descrip_prestacion }} - ${{ prestacion.valor_prestacion }}
          </option>
        </select>
        <button type="button" @click="agregarPrestacion">Agregar Prestación</button>
      </div>

      <ul>
        <li v-for="(prestacion, index) in prestacionesSeleccionadas" :key="index">
          {{ prestacion.descrip_prestacion }} - ${{ prestacion.valor_prestacion }}
          <button type="button" @click="eliminarPrestacion(index)">Eliminar</button>
        </li>
      </ul>

      <button type="submit">Crear DCM</button>
    </form>
  </div>
<exportedForm />
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      descripcion: "",
      prestaciones: [],
      prestacionSeleccionada: null,
      prestacionesSeleccionadas: [],
    };
  },
  methods: {
    async obtenerPrestaciones() {
      try {
        const response = await axios.get("http://localhost:5000/api/prestaciones");
        this.prestaciones = response.data;
      } catch (error) {
        console.error("Error al obtener prestaciones:", error);
      }
    },
    agregarPrestacion() {
      if (this.prestacionSeleccionada) {
        this.prestacionesSeleccionadas.push(this.prestacionSeleccionada);
        this.prestacionSeleccionada = null;
      }
    },
    eliminarPrestacion(index) {
      this.prestacionesSeleccionadas.splice(index, 1);
    },
    async crearDcm() {
      try {
        const dcm = {
          descripcion: this.descripcion,
          prestaciones: this.prestacionesSeleccionadas,
        };

        await axios.post("http://localhost:5000/api/dcm", dcm);
        alert("DCM creado con éxito");
        this.descripcion = "";
        this.prestacionesSeleccionadas = [];
      } catch (error) {
        console.error("Error al crear DCM:", error);
        alert("Error al crear el DCM");
      }
    },
  },
  mounted() {
    this.obtenerPrestaciones();
  },
};
</script>