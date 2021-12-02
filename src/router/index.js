import { createRouter, createWebHistory } from 'vue-router'
import apolloClient from '@/apollo/client'
import getCurrentUser from '@/apollo/queries/getCurrentUser'
import Welcome from '@/views/Welcome.vue'

const enforceAuth = async (to, from, next) => {
	const { data: { currentUser: { authenticated } } } = await apolloClient.query({ query: getCurrentUser })

	if (!authenticated) {
		return next('/')
	}

	next()
}

const redirectAuthed = async (to, from, next) => {
	const { data: { currentUser: { authenticated } } } = await apolloClient.query({ query: getCurrentUser })

	if (authenticated) {
		return next('/home')
	}

	next()
}

const routes = [
	{
		path: '/',
		name: 'Welcome',
		component: Welcome,
		beforeEnter: redirectAuthed,
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
		beforeEnter: redirectAuthed,
	},
	{
		path: '/signup',
		name: 'Signup',
		component: () => import(/* webpackChunkName: "signup" */ '../views/Signup.vue'),
		beforeEnter: redirectAuthed,
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
