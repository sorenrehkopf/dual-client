<template>
	<div id="map"></div>

	<button
		v-if="enableAreaSearch"
		class="button"
		id="area-search-button"
		@click="searchCurrentArea"
	>
		Search This Area
	</button>

	<ResourceFilters
		v-if="!enableAdd"
		id="mapbox-resource-filters"
	/>

	<AddResourceDialog
		v-if="enableAdd"
		id="add-dialog"
		class="has-background-white p-3"
		:addCoords="addCoords"
		:handleResourceAdd="handleResourceAdd"
	/>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import apolloClient from '@/apollo/client'
import getResources from '@/apollo/queries/getResources'
import AddResourceDialog from '@/components/AddResourceDialog'
import ResourceFilters from '@/components/ResourceFilters'

export default {
	name: 'MapBox',

	props: {
		enableAdd: Boolean,
		disableAdd: Function,
	},

	data () {
		return {
			addCoords: { lat: 0, lon: 0 },
			enableAreaSearch: false,
			userCoords: { lat: 0, lon: 0 },
			markers: [],
		}
	},

	components: {
		AddResourceDialog,
		ResourceFilters,
	},

	async mounted () {
		await this.setUserCoords()
		await this.createMap()
	},

	methods: {
		handleResourceAdd (newResource) {
			this.addMarker(newResource)
			this.disableAdd()
		},

		async searchCurrentArea () {
			const { lat, lon } = this.userCoords
			const {
				_ne: { lng: e, lat: n },
				_sw: { lng: w, lat: s },
			} = this.map.getBounds()

			const { data: { resources } } = await apolloClient.query({
				query: getResources,
				variables: { lat, lon, bounds: { n, s, e, w } }
			})

			this.markers.forEach(m => m.remove())
			this.enableAreaSearch = false

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

			console.log('the resources!!', resources)

			mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/streets-v11',
				scrollZoom: true,
				center: [lon, lat],
				zoom: 14
			})

			this.map.on('click', ({ lngLat: { lng: lon, lat } }) => {
				this.addCoords = { lat, lon }
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
		height: 94vh;

		.marker {
			background: hotpink;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			cursor: pointer;
		}
	}

	#add-dialog {
		position: absolute;
		top: 10vh;
		left: 10vw;
	}

	#mapbox-resource-filters {
		position: absolute;
		top: 10vh;
		left: 10vw;
	}

	#area-search-button {
		position: absolute;
		bottom: 5vh;
		left: 40vw;
		opacity: .7;
	}

</style>
