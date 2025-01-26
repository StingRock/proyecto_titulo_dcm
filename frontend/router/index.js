import { createRouter, createWebHistory } from 'vue-router'
import ingresoUsuario from '@/components/ingresoUsuario.vue'
import gestionPacientes from '@/components/menuPrincipal/gestionPacientes/gestionPacientes.vue'
import creacionPaciente from '@/components/menuPrincipal/gestionPacientes/creacionPaciente.vue'
import modificacionPaciente from '@/components/menuPrincipal/gestionPacientes/modificacionPaciente.vue'
import gestionDcm from '@/components/menuPrincipal/gestionDcm/gestionDcm.vue'
import creacionDcm from '@/components/menuPrincipal/gestionDcm/creacionDcm.vue'
import listadoRegistroDcm from '@/components/menuPrincipal/gestionDcm/listadoRegistroDcm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ingresoUsuario',
      component: ingresoUsuario
    },
    {
      path: '/gestionPacientes',
      name: 'gestionPacientes',
      component: gestionPacientes
    },
    {
      path: '/creacionPaciente',
      name: 'creacionPaciente',
      component: creacionPaciente
    },
    {
      path: '/modificacionPaciente',
      name: 'modificacionPaciente',
      component: modificacionPaciente
    },
    {
      path: '/gestionDcm',
      name: 'gestionDcm',
      component: gestionDcm
    },
    {
      path: '/creacionDcm',
      name: 'creacionDcm',
      component: creacionDcm
    },
    {
      path: '/listadoRegistroDcm',
      name: 'listadoRegistroDcm',
      component: listadoRegistroDcm
    },
  ]
});

router.beforeEach((to, from, next) => {
  const userType = localStorage.getItem('userType');

  if (to.path !== '/' && !userType) {
    next('/');
  } else if (to.path === '/modificacionPaciente' && userType !== '1') {
    next('/gestionPacientes');
  } else {
    next();
  }
});

export default router
