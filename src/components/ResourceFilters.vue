<template>
	<div class="has-background-white p-3">
		<span v-if="!open" class="icon  is-clickable" @click="open = true">
			<i class="fa-solid fa-magnifying-glass"></i>
		</span>

		<div v-if="open" class="filters-form">
			<div class="field is-horizontal is-flex">
				<label class="label">Tags:</label>

				<span
					v-for="tag in selectedTags"
					:key="tag"
					class="tag mr-2"
				>
					{{tag}}
					<span @click="() => deselectTag(tag)" class="p-1 ml-1 is-clickable">X</span>
				</span>

				<div class="select is-small">
					<select @change="selectTag">
						<option></option>
						<option
							v-for="tag in availableTags.sort()"
							:value="tag"
							:key="tag"
						>
							{{tag}}
						</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import apolloClient from '@/apollo/client'
import getTags from '@/apollo/queries/getTags'

export default {
	name: 'ResourceFilters',
	props: {

	},
	data () {
		return {
			selectedTags: [],
			availableTags: [],
			open: true,
		}
	},

	async mounted () {
		const { data: { tags } } = await apolloClient.query({
			query: getTags,
		})

		console.log('the tags!!!!!!', tags)

		this.availableTags = tags.map(({ name }) => name)
	},

	methods: {
		selectTag ({ target: { value } }) {
			this.selectedTags.push(value)
			this.availableTags = this.availableTags.filter(tag => tag !== value)
		},

		deselectTag (value) {
			this.availableTags.push(value)
			this.selectedTags = this.selectedTags.filter(tag => tag !== value)
		}
	}
}
</script>

<style lang="scss" scoped >
	.filters-form {
		min-width: 30vh;
	}
</style>
