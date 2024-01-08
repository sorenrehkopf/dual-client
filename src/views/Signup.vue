<template>
	<section class="section">
		<h1 class="title">Signup!</h1>

		<form
			@submit="handleSubmit"
			class="container is-fluid is-flex is-justify-content-center is-flex-direction-column is-align-items-center"
		>
			<div class="field">
				<label class="label">Name</label>
				<div class="control has-icons-left has-icons-right">
					<input class="input" type="text" placeholder="Community Member" v-model="name">
					<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					</span>
					<span class="icon is-small is-right">
						<i class="fas fa-exclamation-triangle"></i>
					</span>
				</div>
			</div>

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
				<p class="help is-danger" v-if="emailIsInvalid">This email is invalid</p>
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
					<button class="button is-link">Submit</button>
				</div>
			</div>

			<div v-if="showErrorNotification">
				something went wrong yo!
			</div>
		</form>

		<div class="mt-3">
			<router-link to="login">Already have an account? Login here!</router-link>
		</div>
	</section>
</template>

<script type="text/javascript">
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apollo/client'
import signupMutation from '@/apollo/mutations/signup'

export default {
	name: 'Signup',

	data: () => ({
		name: '',
		email: '',
		password: '',
		tnc: false,
		emailIsInvalid: false,
		showErrorNotification: false
	}),

	setup: () => {
		const { mutate: signup } = useMutation(signupMutation)

		return { signup }
	},

	methods: {
		handleSubmit: async function (e) {
			const { name, email, password, signup } = this

			e.preventDefault()
			signup({ name, email, password })
				.then(({ data: { signup: { token } } }) => {
					localStorage.setItem('authToken', token)
					apolloClient.clearStore()
					this.$router.push('/')
				})
				.catch(error => {
					this.showErrorNotification = true
				})

			return false
		}
	}
}
</script>
