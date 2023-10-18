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
				<input class="input" readonly type="text" placeholder="Click the map!" :value="`Lat: ${addCoords.lat}, Lon: ${addCoords.lon}`">
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

		<div class="field">
			<div class="control">
				<button class="button is-primary" type="text" @click="handleAddResource">Add!</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'
import addResourceMutation from '@/apollo/mutations/addResource'

export default {
	name: 'AddResourceDialog',
	props: {
		disableAdd: Function,
		handleResourceAdd: Function,
		addCoords: Object,
	},
	data () {
		return {
			name: '',
			description: '',
			address: '',
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
				addCoords: { lat, lon },
				handleResourceAdd,
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
