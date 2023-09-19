<template>
	<div id="map"></div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import apolloClient from '@/apollo/client'
import getResources from '@/apollo/queries/getResources'

export default {
	name: 'MapBox',
	props: {},
	mounted () {
		this.createMap()
	},
	methods: {
		async createMap () {
			mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN

			const { coords: { latitude = 0, longitude = 0 } = {} } = await new Promise(
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

			const { data: { resources } } = await apolloClient.query({ query: getResources })

			console.log('the resources!!', resources)

			this.map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [longitude, latitude],
				zoom: 14
			})

			resources.forEach(({ lat, lon, name, description }) => {
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
			})
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

</style>
