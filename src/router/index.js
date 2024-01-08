import { createRouter, createWebHistory } from 'vue-router'
import apolloClient from '@/apollo/client'
import getCurrentUser from '@/apollo/queries/getCurrentUser'

const enforceAuth = async (to, from, next) => {
	const {
		data: {
			currentUser: { authenticated },
		},
	} = await apolloClient.query({ query: getCurrentUser })

	if (!authenticated) {
		return next('/')
	}

	next()
}

const redirectAuthed = async (to, from, next) => {
	const {
		data: {
			currentUser: { authenticated },
		},
	} = await apolloClient.query({ query: getCurrentUser })

	if (authenticated) {
		return next('/')
	}

	next()
}

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home/index.vue'),
	},
	{
		path: '/account',
		name: 'Account',
		component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue'),
		beforeEnter: enforceAuth,
	},
	{
		path: '/login',
		name: 'Login',
		component: () =>
			import(/* webpackChunkName: "login" */ '../views/Login.vue'),
		beforeEnter: redirectAuthed,
	},
	{
		path: '/signup',
		name: 'Signup',
		component: () =>
			import(/* webpackChunkName: "signup" */ '../views/Signup.vue'),
		beforeEnter: redirectAuthed,
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
