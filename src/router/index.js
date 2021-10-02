import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'

const getUser = () => new Promise(resolve => resolve({ authenticated: true }))

const enforceAuth = async (to, from, next) => {
	const { authenticated } = await getUser()

	if (!authenticated) {
		return next('/')
	}

	next()
}

const routes = [
	{
		path: '/',
		name: 'Welcome',
		component: Welcome,
		beforeEnter: async (to, from, next) => {
			const { authenticated } = await getUser()

			if (authenticated) {
				return next('/home')
			}

			next()
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
		beforeEnter: enforceAuth,
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
