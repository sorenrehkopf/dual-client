import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from '@/apollo/client'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/assets/main.scss'

createApp({
	setup () {
		provide(DefaultApolloClient, apolloClient)
	},

	render: () => h(App),
}).use(router).mount('#app')
