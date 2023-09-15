<template>
	<div class="single-page-wrapper is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
		<div class="navbar has-background-dark is-width-100">
			<RouterLink to="/login" class="button mr-4">Login</RouterLink>
			<RouterLink to="/signup" class="button">Signup</RouterLink>
		</div>

		<div class="is-flex-grow-1">
			<MapBox />
		</div>

	</div>
</template>

<script type="text/javascript">
import MapBox from '@/components/MapBox'

export default {
	name: 'Welcome',
	components: {
		MapBox,
	},
}
</script>

<style type="text/scss">
	.navbar {
		width: 100vh;
	}
</style>
