<template>
	<div class="single-page-wrapper is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
		<div class="navbar has-background-dark is-width-100 is-flex is-justify-content-flex-end py-1 px-5">
			<button class="button" @click="yo">Add Resource</button>
		</div>

		<div class="is-flex-grow-1">
			<MapBox :enableAdd="addingResource" :disableAdd="() => { addingResource = false }" />
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
	data () {
		return {
			addingResource: true
		}
	},
	methods: {
		yo () {
			console.log('woaaaah', this.addingResource)
			this.addingResource = !this.addingResource
		}
	}
}
</script>

<style type="text/scss">
	.navbar {
		width: 100vh;
	}
</style>
