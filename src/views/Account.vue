<template>
  <div>
    Account view yo.

    <div @click="handleSignout">Signout</div>
  </div>
</template>

<script>
import apolloClient from '@/apollo/client'

export default {
	name: 'Account',

	methods: {
		handleSignout () {
			localStorage.removeItem('authToken')
			apolloClient.cache.reset()
			this.$router.push('/')
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
