<template>
	<div>
		<div v-if="!!weeklyHours.length" class="mb-2">
			<div v-for="hour in weeklyHours" :key="hour" class="is-size-6">
				{{getWeekdayShortName(hour.weekday)}} - {{getShortTimeDisplay(hour.startTime)}} - {{getShortTimeDisplay(hour.endTime)}}
			</div>
		</div>

		<div v-if="!!onceHours.length">
			<div v-for="hour in onceHours" :key="hour" class="is-size-6">
				{{getShortDateDisplay(hour.start)}} - {{getShortDateDisplay(hour.end)}}
			</div>
		</div>

		<div v-if="editable" class="mt-2">
			<span
				class="is-clickable is-underlined"
				@click="changing = true"
			>
				{{schedule.length ? 'Change' : 'Add Hours'}}
			</span>

			<!-- adding hours below -->

			<div
				v-if="changing"
				class="change-dialog has-background-white p-3"
			>
				<div
					v-for="hour in weeklyHours"
					:key="hour"
					class="is-size-6 card p-2 mb-3 is-flex is-justify-content-space-between"
				>
					<span>{{getWeekdayShortName(hour.weekday)}} - {{getShortTimeDisplay(hour.startTime)}} - {{getShortTimeDisplay(hour.endTime)}}</span>
					<span @click="removeAvailability(hour.scheduleIndex)" class="icon is-clickable">
						<i class="fa-solid fa-trash	"></i>
					</span>
				</div>

				<div
					v-for="hour in onceHours"
					:key="hour"
					class="is-size-6 card p-2 mb-3 is-flex is-justify-content-space-between"
				>
					<span>{{getShortDateDisplay(hour.start)}} - {{getShortDateDisplay(hour.end)}}</span>
					<span @click="removeAvailability(hour.scheduleIndex)" class="icon is-clickable">
						<i class="fa-solid fa-trash	"></i>
					</span>
				</div>

				<div class="card">
					<div class="card-header">
						<p class="card-header-title">
							<span>New:</span>
							<span class="select is-small ml-2">
								<select
									@change="({ target: { value } }) => addData.type = value"
									:value="addData.type"
								>
									<option
										v-for="type in ['weekly', 'once']"
										:value="type"
										:key="type"
									>
										{{type}}
									</option>
								</select>
							</span>
						</p>
					</div>

					<div class="card-content">
						<div v-if="addData.type === 'weekly'">
							<div class="field is-flex">
								<label class="label mr-2">Day:</label>
								<span class="select is-small">
									<select @change="({ target: { value } }) => addData.weekday = parseInt(value)">
										<option></option>
										<option
											v-for="weekday in [0,1,2,3,4,5,6]"
											:value="weekday"
											:key="weekday"
										>
											{{getWeekdayShortName(weekday)}}
										</option>
									</select>
								</span>
							</div>

							<div class="field is-flex">
								<label class="label mr-2">Start:</label>
								<div class="control">
									<input
										class="mr-2"
										type="time"
										:value="addData.startTime"
										@change="({ target: { value } }) => addData.startTime = value"
									/>
								</div>
							</div>

							<div class="field is-flex">
								<label class="label mr-2">End:</label>
								<div class="control">
									<input
										class="mr-2"
										type="time"
										:value="addData.endTime"
										@change="({ target: { value } }) => addData.endTime = value"
									/>
								</div>
							</div>
						</div>

						<div v-if="addData.type === 'once'">
							<div class="field is-flex">
								<label class="label mr-2">Start:</label>
								<div class="control">
									<input
										class="mr-2"
										type="datetime-local"
										:min="getDateForCalendarInput()"
										:value="addData.startDatetime"
										@change="({ target: { value } }) => addData.startDatetime = value"
									/>
								</div>
							</div>

							<div class="field is-flex">
								<label class="label mr-2">End:</label>
								<div class="control">
									<input
										class="mr-2"
										:disabled="!addData.startDatetime"
										type="datetime-local"
										:min="addData.startDatetime"
										:value="addData.endDatetime"
										@change="({ target: { value } }) => addData.endDatetime = value"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="card-footer">
						<button
							class="card-footer-item is-clickable has-text-link button"
							:disabled="!addDataComplete"
							@click="handleAdd"
						>
							Add
						</button>
						<span
							class="card-footer-item is-clickable has-text-link"
							@click="addData = { type: 'weekly' }"
						>
							Reset
						</span>
					</div>
				</div>

				<div class="control mt-5">
					<button
						class="button is-primary mr-3"
						type="text"
						@click="changing = false"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getShortDateDisplay,
	getShortTimeDisplay,
	getWeekdayShortName,
	getDateForCalendarInput
} from '@/utils/dateFormatters'

export default {
	name: 'ScheduleDisplay',

	props: {
		editable: Boolean,
		schedule: Array,
		onChange: Function,
	},

	data () {
		return {
			changing: false,
			addData: { type: 'weekly' },
			getDateForCalendarInput,
			getWeekdayShortName,
			getShortTimeDisplay,
			getShortDateDisplay,
		}
	},

	computed: {
		onceHours () {
			return this.schedule
				.map(({ startDatetime, endDatetime, type }, scheduleIndex) => ({
					type,
					scheduleIndex,
					start: startDatetime,
					end: endDatetime,
				}))
				.filter(({ type }) => type === 'once')
		},

		weeklyHours () {
			return this.schedule
				.map(({ weekday, startTime, endTime, type }, scheduleIndex) => ({
					type,
					scheduleIndex,
					weekday: weekday,
					startTime,
					endTime,
				}))
				.filter(({ type }) => type === 'weekly')
				.sort(({ weekday: a }, { weekday: b }) => a - b)
		},

		addDataComplete () {
			const {
				addData: {
					type,
					startDatetime,
					endDatetime,
					startTime,
					endTime,
				}
			} = this

			return (type === 'once' && startDatetime && endDatetime) ||
				(type === 'weekly' && startTime && endTime)
		}
	},

	methods: {
		removeAvailability (index) {
			const { onChange, schedule } = this

			onChange(schedule.filter((_a, i) => i !== index))
		},

		handleAdd () {
			const { onChange, schedule } = this

			if (this.addData.type === 'once') {
				this.addData.startDatetime = new Date(this.addData.startDatetime)
				this.addData.endDatetime = new Date(this.addData.endDatetime)
			}

			onChange([...schedule, this.addData])
			this.addData = { type: 'weekly' }
		}
	}
}
</script>

<style lang="scss" scoped>
.change-dialog {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	z-index: 10;
}
</style>
