<template>
	<div class="has-background-white p-3">
		<div class="filters-form has-text-left">
			<div class="field">
				<label class="label">Tags:</label>

				<TagSelector
					:selectedTags="store.filters.tags || []"
					:onChange="handleTagsChange"
				/>
			</div>

			<div class="field">
				<label class="label">Open at:</label>

				<div class="control is-flex">
					<input
						class="mr-2"
						type="datetime-local"
						:min="getNowFormatted()"
						:value="store.filters.open"
						@change="({ target: { value } }) => store.filters.open = value"
					/>

					<div class="mt-2">
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
			</div>

			<div class="field is-grouped mt-5">
				<div class="control">
					<button
						class="button is-primary"
						@click="search"
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
import TagSelector from '@/components/TagSelector'

export default {
	name: 'ResourceFilters',

	components: {
		TagSelector,
	},

	props: {
		search: Function,
	},

	data () {
		return {
			store,
		}
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

		handleTagsChange (selectedTags) {
			store.filters.tags = selectedTags.length ? selectedTags : undefined
		}
	}
}
</script>

<style lang="scss" scoped >
	.filters-form {
		max-width: 60vh;
	}
</style>
