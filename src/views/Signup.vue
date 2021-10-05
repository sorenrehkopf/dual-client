<template>
	<section class="section">
		<p class="title">Signup!</p>

		<section class="container is-fluid is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
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

			<div class="field">
				<div class="control">
					<label class="checkbox">
						<input type="checkbox" v-model="tnc">
						I agree to the <a href="#">terms and conditions</a>
					</label>
				</div>
			</div>

			<div class="field is-grouped">
				<div class="control is-fullwidth">
					<button class="button is-link" @click="() => signup({ name, email, password })">Submit</button>
				</div>
			</div>
		</section>
	</section>
</template>

<script type="text/javascript">
import { useMutation } from '@vue/apollo-composable'
import signupMutation from '@/apollo/mutations/signup'

export default {
	name: 'Signup',

	data: () => ({
		name: '',
		email: '',
		password: '',
		tnc: false,
		emailIsInvalid: false,
	}),

	setup: () => {
		const { mutate: signup } = useMutation(signupMutation)

		return { signup }
	}
}
</script>
