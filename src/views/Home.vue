<template>
  <section class="section">
    <p class="title">Welcome user!</p>
    <span @click="handleSignout">Signout</span>
  </section>
</template>

<script>
import apolloClient from '@/apollo/client'

export default {
	name: 'Home',
	methods: {
		handleSignout: function () {
			localStorage.removeItem('authToken')
			apolloClient.clearStore()
			this.$router.push('/')
		}
	}
}
</script>
