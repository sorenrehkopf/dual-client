import { reactive } from 'vue'

export const store = reactive({
	showFilters: false,
	showAddDialog: true,
	showAddCoordsConfirm: false,
	addParams: {
		coords: { lat: 0, lon: 0 },
		name: '',
		description: '',
		address: '',
		tags: [],
	},
	filters: {},
})
