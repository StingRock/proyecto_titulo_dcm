<template>
  <div class="crear-dcm">
    <h1>Creación de Detalle de Cuenta Médica</h1>
    <form @submit.prevent="crearDcm">
      <div>
        <label for="rut_paciente">RUT:</label>
        <input id="rut_paciente" v-model="paciente.rut_paciente" required />
        <label for="dv_paciente">-</label>
        <input id="dv_paciente" v-model="paciente.dv_paciente" readonly />
      </div>
      <div>
        <label for="nombre">Nombre:</label>
        <input id="nombre" v-model="paciente.nombre" required readonly />
      </div>
      <div>
        <label for="apellido_paterno">Apellido Paterno:</label>
        <input id="apellido_paterno" v-model="paciente.apellido_paterno" required readonly />
      </div>
      <div>
        <label for="apellido_materno">Apellido Materno:</label>
        <input id="apellido_materno" v-model="paciente.apellido_materno" readonly />
      </div>
      <div>
        <label for="prevision">Previsión:</label>
        <input id="prevision" v-model="paciente.prevision" readonly />
      </div>
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
        <br>
        <br>
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
 
 <script setup>
 import { ref, watch } from "vue";
 import axios from "axios";
 import exportedForm from "@/components/exportedForm.vue";
 
 const paciente = ref({
  rut_paciente: "",
  dv_paciente: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  prevision: "",
 });
 const descripcion = ref("");
 const prestaciones = ref([]);
 const prestacionSeleccionada = ref(null);
 const prestacionesSeleccionadas = ref([]);
 
 function calcularDigitoVerificador(rut) {
  if (!rut) return "";
  let suma = 0;
  let multiplicador = 2;
 
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
 
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return resto.toString();
 }
 
 watch(
  () => paciente.value.rut_paciente,
  async (nuevoRut) => {
    if (nuevoRut) {
      // Limpia el RUT dejando solo números
      const rutSinFormato = nuevoRut.replace(/\D/g, "");
      
      // Solo procede si hay números
      if (rutSinFormato.length > 0) {
        paciente.value.dv_paciente = calcularDigitoVerificador(rutSinFormato);

        try {
          const response = await axios.get(`http://localhost:5000/api/pacientes/${rutSinFormato}`);
          console.log('Respuesta API:', response.data); // Para debugging
          
          if (response.data) {
            const datosPaciente = response.data;
            Object.assign(paciente.value, {
              nombre: datosPaciente.nombre,
              apellido_paterno: datosPaciente.apellido_paterno,
              apellido_materno: datosPaciente.apellido_materno,
              prevision: datosPaciente.prevision
            });
          }
        } catch (error) {
          console.error("Error al obtener los datos del paciente:", error);
          // Limpiar campos si hay error
          Object.assign(paciente.value, {
            nombre: "",
            apellido_paterno: "",
            apellido_materno: "",
            prevision: ""
          });
        }
      }
    }
  }
);
 
 async function obtenerPrestaciones() {
  try {
    const response = await axios.get("http://localhost:5000/api/prestaciones");
    prestaciones.value = response.data;
  } catch (error) {
    console.error("Error al obtener prestaciones:", error);
  }
 }
 
 function agregarPrestacion() {
  if (prestacionSeleccionada.value) {
    if (!prestacionesSeleccionadas.value.some((p) => p.codigo_prestacion === prestacionSeleccionada.value.codigo_prestacion)) {
      prestacionesSeleccionadas.value.push(prestacionSeleccionada.value);
    }
    prestacionSeleccionada.value = null;
  }
 }
 
 function eliminarPrestacion(index) {
  prestacionesSeleccionadas.value.splice(index, 1);
 }
 
 async function crearDcm() {
  try {
    const dcm = {
      paciente: paciente.value,
      descripcion: descripcion.value,
      prestaciones: prestacionesSeleccionadas.value,
    };
 
    await axios.post("http://localhost:5000/api/dcm", dcm);
    alert("DCM creado con éxito");
 
    paciente.value = {
      rut_paciente: "",
      dv_paciente: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      prevision: "",
    };
    descripcion.value = "";
    prestacionesSeleccionadas.value = [];
  } catch (error) {
    console.error("Error al crear DCM:", error);
    alert("Error al crear el DCM");
  }
 }
 
 obtenerPrestaciones();
 </script>
 
 <style>
 .crear-dcm {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 900px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
 }
 
 h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
 }
 
 .crear-dcm form {
  display: flex;
  flex-direction: column;
  gap: 16px;
 }
 
 .crear-dcm label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
  color: #555;
 }
 
 .crear-dcm input,
 .crear-dcm select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
 }
 
 .crear-dcm input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
 }
 
 .crear-dcm button {
  background-color: #007bff;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
 }
 
 .crear-dcm button:hover {
  background-color: #0056b3;
 }
 
 .crear-dcm ul {
  list-style: none;
  padding: 0;
  margin: 0;
 }
 
 .crear-dcm li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
 }
 
 .crear-dcm li button {
  background-color: #dc3545;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
 }
 
 .crear-dcm li button:hover {
  background-color: #a71d2a;
 }
 
 .crear-dcm .error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
 }
 
 .crear-dcm .success-message {
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
 }
 </style>