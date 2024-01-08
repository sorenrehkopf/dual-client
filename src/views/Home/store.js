import { reactive } from 'vue'

const startDatetime = new Date()
startDatetime.setHours(startDatetime.getHours() - 3)
const endDatetime = new Date()
endDatetime.setHours(new Date().getHours() + 2)

export const store = reactive({
	showFilters: false,
	showAddDialog: false,
	showAddCoordsConfirm: false,
	addParams: {
		coords: { lat: 0, lon: 0 },
		name: '',
		description: '',
		address: '',
		tags: [],
		schedule: [
			{ type: 'once', startDatetime, endDatetime },
			{ type: 'weekly', weekday: 1, startTime: '08:00:00', endTime: '17:00' },
			{ type: 'weekly', weekday: 2, startTime: '08:00:00', endTime: '17:00' },
			{ type: 'weekly', weekday: 3, startTime: '00:30:00', endTime: '17:00' },
			{ type: 'weekly', weekday: 4, startTime: '08:00:00', endTime: '17:00' },
		],
	},
	filters: {},
})
