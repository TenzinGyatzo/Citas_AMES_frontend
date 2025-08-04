import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppointmentsLayout from '../views/appointments/AppointmentsLayout.vue'
import AuthAPI from '@/api/AuthAPI.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAdmin: true},
      children: [
        {
          path: '',
          name: 'admin-appointments',
          component: () => import('../views/admin/AppointmentsView.vue'),
        },
        {
          path: 'reglas-horarios',
          name: 'admin-hour-rules',
          component: () => import('../views/admin/HourRulesView.vue'),
        }
      ]
    },
    {
      path: '/citas',
      name: 'appointments',
      component: AppointmentsLayout,
      meta: { requiresAuth: true},
      children: [
        {
          path: '',
          name: 'my-appointments',
          component: () => import('../views/appointments/MyAppointmentsView.vue')
        },
        {
          path: 'nueva',
          component: () => import('../views/appointments/NewAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'new-appointment',
              component: () => import('../views/appointments/WorkerView.vue')
            },
            {
              path: 'servicios',
              name: 'appointment-services',
              component: () => import('../views/appointments/ServicesView.vue')
            },
            {
              path: 'fecha-y-hora',
              name: 'appointment-date',
              component: () => import('../views/appointments/DateView.vue')
            },
            {
              path: 'detalles',
              name: 'appointment-details',
              component: () => import('../views/appointments/AppointmentDetailsView.vue')
            },

          ]
        },
        {
          path: ':id/editar',
          component: () => import('../views/appointments/EditAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'edit-appointment',
              component: () => import('../views/appointments/WorkerView.vue')
            },
            {
              path: 'servicios',
              name: 'edit-appointment-services',
              component: () => import('../views/appointments/ServicesView.vue')
            },
            {
              path: 'fecha-y-hora',
              name: 'edit-appointment-date',
              component: () => import('../views/appointments/DateView.vue')
            },
            {
              path: 'detalles',
              name: 'edit-appointment-details',
              component: () => import('../views/appointments/AppointmentDetailsView.vue')
            },

          ]
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/AuthLayout.vue'),
      children: [
        {
          path: 'registro',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue')
        },
        {
          path: 'confirmar-cuenta/:token',
          name: 'confirm-account',
          component: () => import('../views/auth/ConfirmAccountView.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue')
        },
        {
          path: 'olvide-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPasswordView.vue')
        },
        {
          path: 'olvide-password/:token',
          name: 'new-password',
          component: () => import('../views/auth/NewPasswordView.vue')
        },
      ]
    }
  ]
})

// Verificación de sesión para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  if (requiresAuth) {
    try {
      const { data } = 	await AuthAPI.auth()
      if(data.admin) {
        next({ name: 'admin-appointments'})
      } else {
        next()
      }
    } catch (error) {
      console.log(error.response.data.msg);
      next({ name: 'login' })
    }
  } else {
    next()
  }
}) 

// Verificación para rutas de administrador
router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(url => url.meta.requiresAdmin)
  if (requiresAdmin) {
    try {
      await AuthAPI.admin()
      next()
    } catch (error) {
      next({ name: 'login' })
    }
  } else {
    next()
  }
}) 

// Verificación para redirigir si ya está autenticado y trata de ir a login
router.beforeEach(async (to, from, next) => {
  if (to.name === 'login') {
    try {
      const { data } = await AuthAPI.auth()
      if (data) {
        // Si el usuario ya está autenticado, redirigir a /citas
        next({ name: 'my-appointments' })
      } else {
        next()
      }
    } catch (error) {
      next()
    }
  } else {
    next()
  }
})

export default router
