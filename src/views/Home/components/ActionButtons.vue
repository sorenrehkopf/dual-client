<template>
	<div>
		<div class="has-background-white p-3 mb-3">
			<span class="icon  is-clickable" @click="store.showFilters = true">
				<i class="fa-solid fa-magnifying-glass"></i>
			</span>
		</div>

		<div class="has-background-white p-3 mb-3">
			<span class="icon  is-clickable" @click="store.showAddDialog = true">
				<i class="fa-solid fa-plus"></i>
			</span>
		</div>

		<div class="has-background-white p-3">
			<span class="icon  is-clickable" @click="handleUserClick">
				<i class="fa-solid fa-user"></i>
			</span>
		</div>
	</div>
</template>

<script>
import { store } from '../store'
import apolloClient from '@/apollo/client'
import getCurrentUser from '@/apollo/queries/getCurrentUser'

export default {
	name: 'ActionButtons',

	async mounted () {
		const {
			data: {
				currentUser: { authenticated },
			},
		} = await apolloClient.query({ query: getCurrentUser })

		this.authenticated = authenticated
	},

	data () {
		return {
			store,
			authenticated: false,
		}
	},

	methods: {
		handleUserClick () {
			const { authenticated } = this
			const destination = authenticated ? '/account' : '/login'

			this.$router.push(destination)
		}
	}
}
</script>

<style lang="scss">

</style>
