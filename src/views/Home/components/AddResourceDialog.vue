<template>
	<div class="has-background-white p-3 has-text-left">
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input" type="text" placeholder="Text input" v-model="name">
			</div>
		</div>

		<div class="field">
			<label class="label">Location</label>
			<div class="control">
				<span class="is-underlined" @click="setAddCoords">
					<i class="fa-solid fa-location-crosshairs mr-2"></i>
					<span v-if="store.addCoords.lat" class="mr-2">
						{{`${store.addCoords.lat.toFixed(5)}, ${store.addCoords.lon.toFixed(5)}`}}
					</span>
					<span v-if="store.addCoords.lat" class="is-clickable">Change</span>
					<span v-if="!store.addCoords.lat" class="is-clickable">Choose on map</span>
				</span>
			</div>
		</div>

		<div class="field">
			<label class="label">Address</label>
			<div class="control">
				<input class="input" type="text" placeholder="Address" v-model="address" />
			</div>
		</div>

		<div class="field">
			<label class="label">Tags:</label>

			<TagSelector
				:onChange="(selectedTags) => tags = selectedTags"
			/>
		</div>

		<div class="field">
			<label class="label">Description</label>
			<div class="control">
				<textarea
					class="textarea"
					type="text"
					placeholder="Any and all details you want to include!"
					v-model="description"
				/>
			</div>
		</div>

		<div class="field is-grouped">
			<div class="control">
				<button
					class="button is-primary"
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
import TagSelector from '@/components/TagSelector'

export default {
	name: 'AddResourceDialog',

	components: {
		TagSelector
	},

	props: {
		handleResourceAdd: Function,
		setAddCoords: Function,
	},

	data () {
		return {
			name: '',
			description: '',
			address: '',
			tags: [],
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
