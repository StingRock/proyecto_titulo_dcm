<template>
  <div class="main-content">
    <h1>Modificación de ficha de Pacientes</h1>
    <div class="formulario">
      <div class="form-group">
        <label for="rut_paciente">Buscar por RUT:</label>
        <br>
        <div class="rut-container">
          <input 
            v-model="rut_paciente" 
            id="rut_paciente" 
            type="text" 
            maxlength="8"
            placeholder="Ingrese el RUT sin dígito"
            pattern="\d*"
            required
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

      <div v-if="paciente">
  <h3>Datos del Paciente</h3>
  <form @submit.prevent="actualizarPaciente">
    <div class="form-group">
      <label for="nombre">Nombre:</label>
      <input 
        v-model="paciente.nombre_pcte" 
        id="nombre" 
        type="text" 
        required 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
    </div>
    <div class="form-group">
      <label for="apellido_paterno">Apellido Paterno:</label>
      <input 
        v-model="paciente.appaterno_pcte" 
        id="apellido_paterno" 
        type="text" 
        required 
      />
      <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
    </div>
    <div class="form-group">
      <label for="apellido_materno">Apellido Materno:</label>
      <input 
        v-model="paciente.apmaterno_pcte" 
        id="apellido_materno" 
        type="text"
        required
      />
      <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
    </div>
    <div class="form-group">
      <label for="contacto">Contacto:</label>
      <input 
        v-model="paciente.contacto_pcte" 
        id="contacto" 
        type="text" 
        pattern="^\d{0,9}$"
        maxlength="9"
        placeholder="Ingrese su número de contacto"
        required
      />
      <small v-if="contactoInvalido" style="color: red;">El campo solo permite números y un mínimo de 9 dígitos, favor de corregir.</small>
    </div>
    <div class="form-group">
      <label for="correo">Correo:</label>
      <input 
        v-model="paciente.correo_pcte" 
        id="correo" 
        type="email" 
        required 
      />
      <small v-if="correoInvalido" style="color: red;">Debe ingresar un correo electrónico válido, favor de corregir.</small>
    </div>
    <div class="form-group">
      <label for="prevision">Previsión:</label>
      <input 
        v-model="paciente.prevision" 
        id="prevision" 
        type="text" 
        required
      />
      <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
    </div>
    <button class="btn" type="submit">Actualizar Paciente</button>
    <button class="btn btn-delete" type="button" @click="eliminarPaciente">Eliminar Paciente</button>
  </form>
</div>
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
const correoInvalido = ref(false);
const contactoInvalido = ref(false);
const camposLetrasInvalido = ref(false);

// Calcular digito verificador
function calcularDigitoVerificador(rut) {
 rut = rut.replace(/\./g, "").replace("-", "").trim();
 if (!/^\d+$/.test(rut) || rut.length < 7 || rut.length > 8) return "";

 let suma = 0;
 let multiplicador = 2;

 for (let i = rut.length - 1; i >= 0; i--) {
   suma += parseInt(rut[i]) * multiplicador;
   multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
 }

 const dvEsperado = 11 - (suma % 11);
 return dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
}

// Validaciones de campos
function validarSoloLetras(campo) {
  if (!campo) return false;
  const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return !soloLetrasRegex.test(campo);
}

watch(rut_paciente, (nuevoRut) => {
  if (!nuevoRut) {
    dv_paciente.value = "";
    return;
  }

  const rutLimpio = nuevoRut.replace(/\D/g, "");
  
  if (nuevoRut !== rutLimpio) {
    rut_paciente.value = rutLimpio;
  }

  if (rutLimpio.length >= 7 && rutLimpio.length <= 8) {
    dv_paciente.value = calcularDigitoVerificador(rutLimpio);
  } else {
    dv_paciente.value = "";
  }
});

watch(() => paciente.value?.correo_pcte, (nuevoCorreo) => {
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  correoInvalido.value = !correoRegex.test(nuevoCorreo || '');
});

watch(() => paciente.value?.contacto_pcte, (nuevoContacto) => {
  if (!nuevoContacto) return;
  if (/[^0-9]/.test(nuevoContacto)) {
    paciente.value.contacto_pcte = nuevoContacto.replace(/[^0-9]/g, '');
  }
  contactoInvalido.value = !/^\d{9}$/.test(nuevoContacto);
});

watch(() => paciente.value?.nombre_pcte, (nuevoValor) => {
  camposLetrasInvalido.value = validarSoloLetras(nuevoValor);
});

watch(() => paciente.value?.appaterno_pcte, (nuevoValor) => {
  camposLetrasInvalido.value = validarSoloLetras(nuevoValor);
});

watch(() => paciente.value?.apmaterno_pcte, (nuevoValor) => {
  camposLetrasInvalido.value = validarSoloLetras(nuevoValor);
});

watch(() => paciente.value?.prevision, (nuevoValor) => {
  camposLetrasInvalido.value = validarSoloLetras(nuevoValor);
});

async function buscarPaciente() {
  try {
    const response = await axios.get(`/api/pacientes/${rut_paciente.value}`);
    paciente.value = response.data;
    mensaje.value = "";
  } catch (error) {
    paciente.value = null;
    mensaje.value = error.response?.data?.error || "Error al buscar el paciente";
  }
}

async function actualizarPaciente() {
  if (!paciente.value) return;

  if (nombreInvalido.value || 
      apellidoPInvalido.value || 
      apellidoMInvalido.value || 
      previsionInvalida.value || 
      correoInvalido.value || 
      contactoInvalido.value) {
    alert("Por favor, corrija los errores antes de actualizar.");
    return;
  }

  try {
    await axios.put(`/api/pacientes/${rut_paciente.value}`, paciente.value);
    alert("Paciente actualizado con éxito");
    limpiarCampos();
  } catch (error) {
    alert(error.response?.data?.message || "Error al actualizar el paciente");
  }
}

async function eliminarPaciente() {
  if (!confirm('Seguro deseas eliminar este paciente? Se perderan datos importantes!')) {
    return;
  }
  try {
    await axios.delete(`/api/pacientes/${rut_paciente.value}`);
    alert('Ficha de Paciente eliminada con Éxito!');
    limpiarCampos();
  } catch (error) {
    alert(error.response?.data?.message || 'Error al eliminar paciente');
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

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  margin-right: 5px;
}

.btn-delete:hover {
  background-color: #c82333;
}

.mensaje-error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>


