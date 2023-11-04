<template>
	<div>
		<span
			v-for="tag in selectedTags"
			:key="tag"
			class="tag mr-2"
		>
			{{tag}}
			<span @click="() => deselectTag(tag)" class="p-1 ml-1 is-clickable">X</span>
		</span>

		<div class="select is-small">
			<select @change="({ target: { value } }) => selectTag(value)">
				<option></option>
				<option
					v-for="tag in notSelectedTags"
					:value="tag"
					:key="tag"
				>
					{{tag}}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
import apolloClient from '@/apollo/client'
import getTags from '@/apollo/queries/getTags'

export default {
	name: 'TagSelector',

	props: {
		onChange: Function
	},

	data () {
		return {
			availableTags: [],
			selectedTags: [],
		}
	},

	computed: {
		notSelectedTags () {
			const { availableTags, selectedTags = [] } = this

			return availableTags.filter(name => !selectedTags.includes(name)).sort()
		}
	},

	async mounted () {
		const { data: { tags } } = await apolloClient.query({
			query: getTags,
		})

		this.availableTags = tags.map(({ name }) => name)
	},

	methods: {
		selectTag (tagName) {
			this.selectedTags.push(tagName)
			this.onChange(this.selectedTags)
		},

		deselectTag (value) {
			this.selectedTags = this.selectedTags.filter(tag => tag !== value)
			this.onChange(this.selectedTags)
		},
	}
}
</script>
