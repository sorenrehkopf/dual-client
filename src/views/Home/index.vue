<template>
	<div id="map"></div>

	<ActionButtons
		class="mapbox-standard-overlay"
		v-if="!store.showFilters && !store.showAddDialog && !store.showAddCoordsConfirm"
	/>

	<ResourceFilters
		v-if="store.showFilters"
		class="mapbox-standard-overlay mapbox-overlay-fs"
		:search="search"
	/>

	<AddResourceDialog
		v-if="store.showAddDialog"
		class="mapbox-standard-overlay mapbox-overlay-fs has-background-white p-3"
		:handleResourceAdd="handleResourceAdd"
		:setAddCoords="setAddCoords"
	/>

	<button
		v-if="enableAreaSearch"
		class="button"
		id="area-search-button"
		@click="search"
	>
		Search This Area
	</button>

	<button
		v-if="store.showAddCoordsConfirm"
		class="button is-primary mapbox-bottom-center-button"
		@click="confirmAddCoords"
		:disabled="!store.addCoords.lat"
	>
		Confirm
	</button>
</template>

<script>
import { store } from './store'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import apolloClient from '@/apollo/client'
import getResources from '@/apollo/queries/getResources'
import AddResourceDialog from './components/AddResourceDialog'
import ActionButtons from './components/ActionButtons'
import ResourceFilters from './components/ResourceFilters'

export default {
	name: 'Home',

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
			addCoordsMarker: new mapboxgl.Marker({ scale: 1.3, color: 'black' }),
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

			const marker = new mapboxgl.Marker({ scale: 1.2 })
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
			store.addCoords = { lat, lon }
		},

		confirmAddCoords () {
			store.showAddCoordsConfirm = false
			store.showAddDialog = true
			this.addCoordsMarker.remove()
			this.markers.forEach(marker => marker.addTo(this.map))
		},

		setAddCoords () {
			const { addCoords: { lon, lat } } = store

			store.showAddCoordsConfirm = true
			store.showAddDialog = false

			this.markers.forEach(marker => marker.remove())
			this.addCoordsMarker.setLngLat([lon, lat]).addTo(this.map)
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
				this.addCoordsMarker.setLngLat([lon, lat])
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
			width: 50px;
			height: 50px;
		}
	}

	.mapbox-standard-overlay {
		position: absolute;
		top: 5vh;
		left: 5vw;
		max-width: 88vw;
	}

	.mapbox-bottom-center-button {
		position: absolute;
		bottom: 5vh;
		left: 40vw;
	}

	#area-search-button {
		opacity: .7;
	}

	@media (max-width: 500px) {
		.mapbox-overlay-fs {
			width: 88vw;
		}

		.mapbox-bottom-center-button {
			left: 30vw;
		}
	}

</style>
