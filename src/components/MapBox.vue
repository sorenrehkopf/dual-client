<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
	name: 'MapBox',
	props: {},
	mounted () {
		this.createMap()
	},
	methods: {
		async createMap () {
			mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/streets-v11',
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	#app {
		width: 500px;
		height: 400px;
	}
</style>
