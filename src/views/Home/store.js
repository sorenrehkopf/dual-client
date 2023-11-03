import { reactive } from 'vue'

export const store = reactive({
	showFilters: false,
	showAddDialog: false,
	addCoords: { lat: 0, lon: 0 },
	filters: {},
})
