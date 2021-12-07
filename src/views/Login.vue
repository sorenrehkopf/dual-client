<template>
	<div class="container is-fluid">
		<form
			@submit="handleSubmit"
			class="container is-fluid is-flex is-justify-content-center is-flex-direction-column is-align-items-center"
		>
			<div class="field">
				<label class="label">Email</label>
				<div class="control has-icons-left has-icons-right">
					<input class="input" type="email" placeholder="friend@techcompany.com" v-model="email">
					<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					</span>
					<span class="icon is-small is-right">
						<i class="fas fa-exclamation-triangle"></i>
					</span>
				</div>
			</div>

			<div class="field">
				<label class="label">Password</label>
				<div class="control has-icons-left has-icons-right">
					<input class="input" type="text" placeholder="$upeR$ecreT" v-model="password">
					<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					</span>
					<span class="icon is-small is-right">
						<i class="fas fa-exclamation-triangle"></i>
					</span>
				</div>
			</div>

			<div class="field is-grouped">
				<div class="control is-fullwidth">
					<button class="button is-link">Login</button>
				</div>
			</div>

			<div v-if="showErrorNotification">
				something went wrong yo!
			</div>
		</form>
	</div>
</template>

<script type="text/javascript">
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apollo/client'
import loginMutation from '@/apollo/mutations/login'

export default {
	name: 'Login',

	data: () => ({
		email: '',
		password: '',
		showErrorNotification: false
	}),

	setup: () => {
		const { mutate: login } = useMutation(loginMutation)

		return { login }
	},

	methods: {
		handleSubmit: async function (e) {
			const { email, password, login } = this

			e.preventDefault()
			login({ email, password })
				.then(({ data: { login: { token } } }) => {
					localStorage.setItem('authToken', token)
					apolloClient.clearStore()
					this.$router.push('Home')
				})
				.catch(error => {
					this.showErrorNotification = true
				})

			return false
		}
	}
}
</script>
