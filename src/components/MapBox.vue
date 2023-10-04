<template>
	<div id="map"></div>

	<div v-if="enableAdd" id="add-dialog" class="has-background-white p-3">
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input" type="text" placeholder="Text input" v-model="addName">
			</div>
		</div>

		<div class="field">
			<label class="label">Coords</label>
			<div class="control">
				<input class="input" readonly type="text" placeholder="Click the map!" :value="`Lat: ${this.addCoords.lat}, Lon: ${this.addCoords.lon}`">
			</div>
		</div>

		<div class="field">
			<label class="label">Description</label>
			<div class="control">
				<textarea class="textarea" type="text" placeholder="Text input" v-model="addDescription" />
			</div>
		</div>

		<div class="field">
			<label class="label">Address</label>
			<div class="control">
				<textarea class="textarea" type="text" placeholder="Text input" v-model="addAddress" />
			</div>
		</div>

		<div class="field">
			<div class="control">
				<button class="button is-primary" type="text" @click="handleAddResource">Add!</button>
			</div>
		</div>
	</div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import apolloClient from '@/apollo/client'
import getResources from '@/apollo/queries/getResources'
import { useMutation } from '@vue/apollo-composable'
import addResourceMutation from '@/apollo/mutations/addResource'

export default {
	name: 'MapBox',
	props: {
		enableAdd: Boolean
	},
	data () {
		return {
			addCoords: { lat: 0, lon: 0 },
			addName: '',
			addDescription: '',
			addAddress: '',
		}
	},
	setup: () => {
		const { mutate: addResource } = useMutation(addResourceMutation)

		return { addResource }
	},
	mounted () {
		this.createMap()
	},
	methods: {
		async handleAddResource () {
			const {
				addResource,
				addCoords: { lat, lon },
				addName: name,
				addDescription: description,
				addAddress: address,
			} = this

			console.log('woah yoooo', lat, lon, name, description, address)

			addResource({ lat, lon, name, description, address })
				.then(resp => {
					console.log('the resp!', resp)
				})
		},

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

			this.map.on('click', ({ lngLat: { lng: lon, lat } }) => {
				this.addCoords = { lat, lon }
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

	#add-dialog {
		position: absolute;
		top: 10vh;
		left: 10vw;
	}

</style>
