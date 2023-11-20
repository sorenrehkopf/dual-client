<template>
	<div>
		<div v-if="!!weeklyHours.length" class="mb-3">
			<div v-for="hour in weeklyHours" :key="hour" class="is-size-6">
				{{hour.weekday}} - {{hour.startTime}} - {{hour.endTime}}
			</div>
		</div>

		<div v-if="!!onceHours.length">
			<div v-for="hour in onceHours" :key="hour" class="is-size-6">
				{{hour.start}} - {{hour.end}}
			</div>
		</div>
	</div>
</template>

<script>
import {
	getShortDateDisplay,
	getShortTimeDisplay,
	getWeekdayShortName
} from '@/utils/dateFormatters'

export default {
	name: 'ScheduleDisplay',

	props: {
		schedule: Array,
	},

	data () {
		return {}
	},

	computed: {
		onceHours () {
			return this.schedule
				.filter(({ type }) => type === 'once')
				.map(({ startDateTime, endDateTime }) => ({
					start: getShortDateDisplay(startDateTime),
					end: getShortDateDisplay(endDateTime),
				}))
		},

		weeklyHours () {
			return this.schedule
				.filter(({ type }) => type === 'weekly')
				.sort(({ weekday: a }, { weekday: b }) => a - b)
				.map(({ weekday, startTime, endTime }) => ({
					weekday: getWeekdayShortName(weekday),
					startTime: getShortTimeDisplay(startTime),
					endTime: getShortTimeDisplay(endTime),
				}))
		},
	},

	methods: {

	}
}
</script>
