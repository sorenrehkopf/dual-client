<template>
	<div class="has-background-white p-3 has-text-left">
		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input
					class="input"
					type="text"
					placeholder="Text input"
					v-model="store.addParams.name"
				/>
			</div>
		</div>

		<div class="field">
			<label class="label">Location</label>
			<div class="control">
				<span class="is-underlined" @click="setAddCoords">
					<i class="fa-solid fa-location-crosshairs mr-2"></i>
					<span v-if="store.addParams.coords.lat" class="mr-2">
						{{`${store.addParams.coords.lat.toFixed(5)}, ${store.addParams.coords.lon.toFixed(5)}`}}
					</span>
					<span v-if="store.addParams.coords.lat" class="is-clickable">Change</span>
					<span v-if="!store.addParams.coords.lat" class="is-clickable">Choose on map</span>
				</span>
			</div>
		</div>

		<div class="field">
			<label class="label">Address</label>
			<div class="control">
				<input
					class="input"
					type="text"
					placeholder="Address"
					v-model="store.addParams.address"
				/>
			</div>
		</div>

		<div class="field">
			<label class="label">Tags:</label>

			<TagSelector
				:selectedTags="store.addParams.tags"
				:onChange="(selectedTags) => store.addParams.tags = selectedTags"
			/>
		</div>

		<div class="field">
			<label class="label">Description</label>
			<div class="control">
				<textarea
					class="textarea"
					type="text"
					placeholder="Any and all details you want to include!"
					v-model="store.addParams.description"
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
				handleResourceAdd,
				store: {
					addParams: {
						coords: { lat, lon },
						name,
						description,
						address,
						tags,
					},
				}
			} = this

			addResource({ lat, lon, name, description, address, tags })
				.then(({ data: { addResource } }) => {
					handleResourceAdd(addResource)

					this.store.addParams = { coords: {}, tags: [] }
				})
		},
	}
}
</script>

<style lang="scss">

</style>
