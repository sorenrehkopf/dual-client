<template>
	<div class="has-background-white p-3">
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input" type="text" placeholder="Text input" v-model="name">
			</div>
		</div>

		<div class="field">
			<label class="label">Coords</label>
			<div class="control">
				<input class="input" readonly type="text" placeholder="Click the map!" :value="`Lat: ${store.addCoords.lat}, Lon: ${store.addCoords.lon}`">
			</div>
		</div>

		<div class="field">
			<label class="label">Description</label>
			<div class="control">
				<textarea class="textarea" type="text" placeholder="Text input" v-model="description" />
			</div>
		</div>

		<div class="field">
			<label class="label">Address</label>
			<div class="control">
				<textarea class="textarea" type="text" placeholder="Text input" v-model="address" />
			</div>
		</div>

		<div class="field is-grouped">
			<div class="control">
				<button
					class="button is-primary mr-3"
					type="text"
					@click="handleAddResource"
				>
					Add
				</button>
			</div>

			<div class="control">
				<button
					class="button"
					type="text"
					@click="store.showAddDialog = false"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { store } from '../store'
import { useMutation } from '@vue/apollo-composable'
import addResourceMutation from '@/apollo/mutations/addResource'

export default {
	name: 'AddResourceDialog',

	props: {
		handleResourceAdd: Function,
	},

	data () {
		return {
			name: '',
			description: '',
			address: '',
			store,
		}
	},

	setup: () => {
		const { mutate: addResource } = useMutation(addResourceMutation)

		return { addResource }
	},

	methods: {
		async handleAddResource () {
			const {
				addResource,
				name,
				description,
				address,
				handleResourceAdd,
				store: { addCoords: { lat, lon } },
			} = this

			addResource({ lat, lon, name, description, address })
				.then(({ data: { addResource } }) => {
					handleResourceAdd(addResource)

					this.name = ''
					this.description = ''
					this.address = ''
				})
		},
	}
}
</script>

<style lang="scss">

</style>
