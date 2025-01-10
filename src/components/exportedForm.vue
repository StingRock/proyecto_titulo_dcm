<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
    if (router.currentRoute.value.path !== '/') {
        router.push('/');
    }
}
</script>

<template>
    <div>
        <ul>
            <li>
                <a href="#" @click.prevent="goToHome">Gestión de Pacientes</a>
            </li>
            <li>
                <router-link to="/creacionPaciente">Creación de Pacientes</router-link>
            </li>
            <li>
                <router-link to="/modificacionPaciente">Modificación de Ficha de Pacientes</router-link>
            </li>
            <li>
                <router-link to="/gestionDcm">Gestión de Detalle de Cuenta Medica</router-link>
            </li>
            <li>
                <router-link to="/creacionDcm">Creación de Detalle de Cuenta Medica</router-link>
            </li>
            <li>
                <router-link to="/listadoRegistroDcm">Listado de Detalles de Cuenta Medica</router-link>
            </li>
        </ul>
    </div>
</template>