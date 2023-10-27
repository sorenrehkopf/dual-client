<template>
	<div class="has-background-white p-3">
		<span v-if="!open" class="icon  is-clickable" @click="toggleFilters">
			<i class="fa-solid fa-magnifying-glass"></i>
		</span>

		<div v-if="open" class="filters-form">
			<div class="field is-horizontal is-flex">
				<label class="label">Tags:</label>

				<span
					v-for="tag in filters.tags"
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

			<div class="field is-horizontal is-flex">
				<label class="label">Open:</label>

				<div class="control">
					<button
						:class="`button is-info ${filters.open ? '' : 'is-light'}`"
						@click="() => setFilters({ open: filters.open ? undefined : [Date().toString()] })"
					>
						Open now
					</button>
				</div>
			</div>

			<div class="field is-grouped">
				<div class="control">
					<button
						class="button is-primary"
						@click="handleSearch"
					>
						Search
					</button>
				</div>

				<div class="control">
					<button
						class="button is-light"
						@click="toggleFilters"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import apolloClient from '@/apollo/client'
import getTags from '@/apollo/queries/getTags'
import pickBy from 'lodash/pickBy.js'

export default {
	name: 'ResourceFilters',
	props: {
		open: Boolean,
		search: Function,
		toggleFilters: Function,
		filters: Object,
		setFilters: Function,
	},

	data () {
		return {
			selectedTags: [],
			availableTags: [],
		}
	},

	async mounted () {
		const { data: { tags } } = await apolloClient.query({
			query: getTags,
		})

		this.availableTags = tags.map(({ name }) => name)
	},

	methods: {
		selectTag ({ target: { value } }) {
			const { tags = [] } = this.filters
			const newTags = [...tags, value]

			this.setFilters({ tags: newTags })
			this.availableTags = this.availableTags.filter(tag => tag !== value)
		},

		deselectTag (value) {
			const { tags } = this.filters

			this.availableTags.push(value)
			const newTags = tags.filter(tag => tag !== value)

			this.setFilters({
				tags: newTags.length ? newTags : undefined
			})
		},

		handleSearch () {
			const { selectedTags: tags } = this

			this.search({ filters: pickBy({ tags: tags.length && tags }) })
		}
	}
}
</script>

<style lang="scss" scoped >
	.filters-form {
		max-width: 60vh;
	}
</style>
