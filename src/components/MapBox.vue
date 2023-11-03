<template>
	<div id="map"></div>

	<ActionButtons
		class="mapbox-standard-overlay"
		v-if="!store.showFilters && !store.showAddDialog"
	/>

	<ResourceFilters
		v-if="store.showFilters"
		class="mapbox-standard-overlay"
		:search="search"
	/>

	<AddResourceDialog
		v-if="store.showAddDialog"
		class="mapbox-standard-overlay has-background-white p-3"
		:handleResourceAdd="handleResourceAdd"
	/>

	<button
		v-if="enableAreaSearch"
		class="button"
		id="area-search-button"
		@click="search"
	>
		Search This Area
	</button>
</template>

<script>
import { reactive } from 'vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import apolloClient from '@/apollo/client'
import getResources from '@/apollo/queries/getResources'
import AddResourceDialog from '@/components/AddResourceDialog'
import ActionButtons from '@/components/ActionButtons'
import ResourceFilters from '@/components/ResourceFilters'

export const store = reactive({
	showFilters: false,
	showAddDialog: false,
	addCoords: { lat: 0, lon: 0 },
	filters: {},
})

export default {
	name: 'MapBox',

	components: {
		ActionButtons,
		AddResourceDialog,
		ResourceFilters,
	},

	data () {
		return {
			enableAreaSearch: false,
			userCoords: { lat: 0, lon: 0 },
			markers: [],
			store,
		}
	},

	async mounted () {
		await this.setUserCoords()
		await this.createMap()
	},

	methods: {

		handleResourceAdd (newResource) {
			this.addMarker(newResource)
			this.showAddDialog = false
		},

		async search () {
			const {
				_ne: { lng: e, lat: n },
				_sw: { lng: w, lat: s },
			} = this.map.getBounds()
			const { userCoords: { lat, lon }, store: { filters } } = this

			const { data: { resources } } = await apolloClient.query({
				query: getResources,
				variables: { lat, lon, bounds: { n, s, e, w }, ...filters }
			})

			this.markers.forEach(m => m.remove())
			this.enableAreaSearch = false
			store.showFilters = false

			resources.forEach(this.addMarker)
		},

		addMarker ({ name, description, lat, lon }) {
			if (!this.map) {
				console.error('Map not initialized yet!')
			}

			const markerEl = document.createElement('div')
			markerEl.classList.add('marker')

			const marker = new mapboxgl.Marker(markerEl)
				.setLngLat([lon, lat])
				.setPopup(
					new mapboxgl.Popup({ offset: 25 })
						.setHTML(
							`<h3>${name}</h3><p>${description}</p>`
						)
				)
				.addTo(this.map)

			this.markers.push(marker)
		},

		async setUserCoords () {
			const { coords: { latitude: lat = 0, longitude: lon = 0 } = {} } = await new Promise(
				(resolve) => {
					navigator.geolocation.getCurrentPosition(
						resolve,
						() => resolve({}),
						{
							enableHighAccuracy: true
						}
					)
				}
			)

			this.userCoords = { lat, lon }
		},

		async createMap () {
			const { userCoords: { lat, lon } } = this

			const { data: { resources } } = await apolloClient.query({
				query: getResources,
				variables: { lat, lon }
			})

			mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/streets-v11',
				scrollZoom: true,
				center: [lon, lat],
				zoom: 14
			})

			this.map.on('click', ({ lngLat: { lng: lon, lat } }) => {
				store.addCoords = { lat, lon }
			})
			this.map.on('dragend', () => { this.enableAreaSearch = true })
			this.map.on('wheel', () => { this.enableAreaSearch = true })

			resources.forEach(this.addMarker)

			const { minLat, minLon, maxLat, maxLon } = resources.reduce(
				({ minLat, minLon, maxLat, maxLon }, { lat: rLat, lon: rLon }) => ({
					minLat: Math.min(rLat, minLat),
					minLon: Math.min(rLon, minLon),
					maxLat: Math.max(rLat, maxLat),
					maxLon: Math.max(rLon, maxLon),
				}), {
					minLat: lat,
					minLon: lon,
					maxLat: lat,
					maxLon: lon,
				}
			)

			this.map.fitBounds([maxLon, minLat, minLon, maxLat], { padding: 80 })
		}
	}
}
</script>

<style lang="scss">
	#map {
		width: 100vw;
		height: 100vh;

		.marker {
			background: hotpink;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			cursor: pointer;
		}
	}

	.mapbox-standard-overlay {
		position: absolute;
		top: 5vh;
		left: 5vw;
	}

	#area-search-button {
		position: absolute;
		bottom: 5vh;
		left: 40vw;
		opacity: .7;
	}

</style>
