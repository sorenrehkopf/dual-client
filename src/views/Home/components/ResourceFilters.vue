<template>
	<div class="has-background-white p-3">
		<div class="filters-form">
			<div class="field is-horizontal is-flex">
				<label class="label">Tags:</label>

				<span
					v-for="tag in store.filters.tags"
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
				<label class="label">Open at:</label>

				<div class="control">
					<input
						class="mr-2"
						type="datetime-local"
						:min="getNowFormatted()"
						:value="store.filters.open"
						@change="({ target: { value } }) => store.filters.open = value"
					/>

					<button
						class="button is-info is-small is-light mr-2"
						@click="() => store.filters.open = getNowFormatted()"
					>
						Now
					</button>

					<button
						class="button is-small"
						@click="() => store.filters.open = undefined"
					>
						Clear
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
						class="button"
						@click="store.showFilters = false"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { store } from '../store'
import apolloClient from '@/apollo/client'
import getTags from '@/apollo/queries/getTags'
import pickBy from 'lodash/pickBy.js'

export default {
	name: 'ResourceFilters',
	props: {
		search: Function,
	},

	data () {
		return {
			selectedTags: [],
			availableTags: [],
			store,
		}
	},

	async mounted () {
		const { data: { tags } } = await apolloClient.query({
			query: getTags,
		})

		this.availableTags = tags.map(({ name }) => name)
	},

	methods: {
		getNowFormatted () {
			const date = new Date()
			const dateFormatted = [
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate(),
			].map(n => (n < 10 ? `0${n}` : n)).join('-')
			const timeFormatted = [date.getHours(), date.getMinutes()]
				.map(n => (n < 10 ? `0${n}` : n))
				.join(':')

			return `${dateFormatted}T${timeFormatted}`
		},

		selectTag ({ target: { value } }) {
			const { tags = [] } = store.filters
			const newTags = [...tags, value]

			store.filters.tags = newTags
			this.availableTags = this.availableTags.filter(tag => tag !== value)
		},

		deselectTag (value) {
			const { tags } = store.filters

			this.availableTags.push(value)
			const newTags = tags.filter(tag => tag !== value)

			store.filters.tags = newTags.length ? newTags : undefined
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
