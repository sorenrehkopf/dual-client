import { createApp, provide, h } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/assets/main.scss'

// HTTP connection to the API
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: 'http://localhost:3020/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
})

createApp({
	setup () {
		provide(DefaultApolloClient, apolloClient)
	},

	render: () => h(App),
}).use(router).mount('#app')
