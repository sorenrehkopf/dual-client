<template>
	<div id="map"></div>

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

export default {
	name: 'MapBox',
	props: {
		enableAdd: Boolean,
		disableAdd: Function
	},
	data () {
		return {
			addCoords: { lat: 0, lon: 0 },
		}
	},
	components: {
		AddResourceDialog,
	},
	mounted () {
		this.createMap()
	},
	methods: {
		handleResourceAdd (newResource) {
			this.addMarker(newResource)
			this.disableAdd()
		},
		addMarker ({ name, description, lat, lon }) {
			if (!this.map) {
				console.error('Map not initialized yet!')
			}

			const markerEl = document.createElement('div')
			markerEl.classList.add('marker')

			new mapboxgl.Marker(markerEl)
				.setLngLat([lon, lat])
				.setPopup(
					new mapboxgl.Popup({ offset: 25 })
						.setHTML(
							`<h3>${name}</h3><p>${description}</p>`
						)
				)
				.addTo(this.map)
		},

		async createMap () {
			mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

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

			const { data: { resources } } = await apolloClient.query({
				query: getResources,
				variables: { lat, lon }
			})

			console.log('the resources!!', resources)

			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [lon, lat],
				zoom: 14
			})

			this.map.on('click', ({ lngLat: { lng: lon, lat } }) => {
				this.addCoords = { lat, lon }
			})

			resources.forEach(this.addMarker)
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

</style>
