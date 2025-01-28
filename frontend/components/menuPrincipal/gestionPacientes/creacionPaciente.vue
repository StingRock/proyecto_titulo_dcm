<template>
  <div class="main-content">
    <h1>Creación de Pacientes</h1>

    <form @submit.prevent="crearPaciente" class="formulario-crear-pacientes">
      <div>
        <label for="rut_paciente">RUT:</label>
        <input
          id="rut_paciente"
          v-model="paciente.rut_paciente"
          maxlength="8"
          placeholder="Ingrese el RUT sin dígito"
          pattern="\d*"
          required
        />
      </div>
      <div>
        <label for="dv_paciente">Dígito Verificador:</label>
        <input 
          id="dv_paciente" 
          v-model="paciente.dv_paciente" 
          placeholder="Dígito verificador" 
          readonly />
      </div>
      <div>
        <label for="nombre">Nombres:</label>
        <input 
          id="nombre" 
          v-model="paciente.nombre" 
          maxlength="50" 
          placeholder="Ej: Kevin Angel" 
          required 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="apellido_paterno">Apellido Paterno:</label>
        <input 
          id="apellido_paterno" 
          v-model="paciente.apellido_paterno" 
          maxlength="30" 
          placeholder="Ej: Navarrete" 
          required 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="apellido_materno">Apellido Materno:</label>
        <input 
          id="apellido_materno" 
          v-model="paciente.apellido_materno" 
          maxlength="30" 
          placeholder="Ej: Baeza" 
          required
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="contacto">Contacto:</label>
        <input
          id="contacto"
          v-model="paciente.contacto"
          type="text"
          pattern="^\d{0,9}$"
          maxlength="9"
          placeholder="Ingrese su número de contacto"
          required
        />
        <small v-if="contactoInvalido" style="color: red;">El campo solo permite números, favor de corregir.</small>
      </div>
      <div>
        <label for="correo">Correo:</label>
        <input
          id="correo"
          v-model="paciente.correo"
          type="email"
          maxlength="80"
          placeholder="Ingrese un correo válido"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          required
        />
        <small v-if="correoInvalido" style="color: red;">Por favor, ingrese un correo válido.</small>
      </div>
      <div>
        <label for="prevision">Previsión:</label>
        <input 
        id="prevision" 
        v-model="paciente.prevision" 
        maxlength="50" 
        placeholder="Ej: Consalud" 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <button type="submit">Guardar</button>
    </form>
    <exportedForm />
  </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import axios from 'axios';
import exportedForm from "@/components/exportedForm.vue";

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

const paciente = reactive({
 rut_paciente: "",
 dv_paciente: "",
 nombre: "",
 apellido_paterno: "",
 apellido_materno: "",
 contacto: "",
 correo: "",
 prevision: "",
});

const correoInvalido = ref(false);
const contactoInvalido = ref(false);
const camposLetrasInvalido = ref(false);

function validarSoloLetras(campo) {
 const soloLetrasRegex = /^[a-zA-Z\s]+$/;
 return !soloLetrasRegex.test(campo);
}

watch(() => paciente.rut_paciente, (nuevoRut) => {
 if (/[^0-9]/.test(nuevoRut)) {
   paciente.rut_paciente = nuevoRut.replace(/[^0-9]/g, '');
 }
 paciente.dv_paciente = calcularDigitoVerificador(nuevoRut);
});

watch(() => paciente.correo, (nuevoCorreo) => {
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  correoInvalido.value = !correoRegex.test(nuevoCorreo || '');
});

watch(() => paciente.contacto, (nuevoContacto) => {
  if (/[^0-9]/.test(nuevoContacto)) {
    paciente.contacto = nuevoContacto.replace(/[^0-9]/g, '');
  }
  contactoInvalido.value = !/^\d{0,9}$/.test(nuevoContacto);
});

// Validaciones de campos de solo letras
['nombre', 'apellido_paterno', 'apellido_materno', 'prevision'].forEach(campo => {
 watch(() => paciente[campo], (nuevoValor) => {
   camposLetrasInvalido.value = validarSoloLetras(nuevoValor);
 });
});

async function crearPaciente() {
 if (correoInvalido.value || contactoInvalido.value ||camposLetrasInvalido.value) {
   alert("Por favor, corrija los errores antes de guardar.");
   return;
 }

 const pacienteData = {
   rut_paciente: paciente.rut_paciente,
   dv_paciente: paciente.dv_paciente,
   nombre_pcte: paciente.nombre,
   appaterno_pcte: paciente.apellido_paterno,
   apmaterno_pcte: paciente.apellido_materno,
   contacto_pcte: paciente.contacto,
   correo_pcte: paciente.correo,
   prevision: paciente.prevision
 };

 try {
    const response = await axios.post('/api/pacientes', pacienteData);
    if (response.data.success) {
      alert('Paciente creado exitosamente');
      limpiarFormulario();
    }
  } catch (error) {
    if (error.response?.status === 400) {
      alert('El paciente ya existe');
      limpiarFormulario();
    } else {
      alert('Error al crear paciente');
    }
  }
}

function limpiarFormulario() {
 Object.keys(paciente).forEach((key) => (paciente[key] = ""));
}
</script>


<style scoped>
.formulario-crear-pacientes {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin: 20px ;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.formulario-crear-pacientes h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.formulario-crear-pacientes label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.formulario-crear-pacientes input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.formulario-crear-pacientes input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  outline: none;
}

.formulario-crear-pacientes button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.formulario-crear-pacientes button:hover {
  background-color: #0056b3;
}
</style>
