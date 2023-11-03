<template>
	<div>
		<div class="has-background-white p-3 mb-3">
			<span class="icon  is-clickable" @click="store.showFilters = true">
				<i class="fa-solid fa-magnifying-glass"></i>
			</span>
		</div>

		<div class="has-background-white p-3 mb-3">
			<span class="icon  is-clickable" @click="store.showAddDialog = true">
				<i class="fa-solid fa-plus"></i>
			</span>
		</div>

		<div class="has-background-white p-3">
			<span class="icon  is-clickable">
				<i class="fa-solid fa-user"></i>
			</span>
		</div>
	</div>
</template>

<script>
import { store } from '@/components/MapBox' // eslint-disable-line

export default {
	name: 'ActionButtons',

	data () {
		return {
			store
		}
	}
}
</script>

<style lang="scss">

</style>
