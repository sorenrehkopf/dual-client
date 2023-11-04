import { reactive } from 'vue'

export const store = reactive({
	showFilters: false,
	showAddDialog: true,
	showAddCoordsConfirm: false,
	addCoords: { lat: 0, lon: 0 },
	filters: {},
})