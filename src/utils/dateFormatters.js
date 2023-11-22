export const getShortDateDisplay = date => {
	const day = date.getDate()
	const month = date.getMonth()
	const year = String(date.getFullYear()).substr(2)
	const hour = date.getHours()
	const minute = date.getMinutes()
	const timeDisplay = getShortTimeDisplay([hour, minute].join(':'))

	return `${day}/${month}/${year}, ${timeDisplay}`
}

export const getShortTimeDisplay = time => {
	const [hour, minute] = time.split(':').map(part => part && Number(part))
	const ampm = hour > 11 ? 'PM' : 'AM'
	const hourDisplay = hour % 12 ? hour % 12 : hour % 12 + 12
	const minuteDisplay = minute > 9 ? minute : `0${minute}`

	return `${hourDisplay}:${minuteDisplay} ${ampm}`
}

export const getWeekdayShortName = numericWeekday =>
	(['Sun', 'Mon', 'Tues', 'Wedns', 'Thurs', 'Fri', 'Sat'][numericWeekday])

export const getDateForCalendarInput = (date = new Date()) => {
	const dateFormatted = [
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate(),
	].map(n => (n < 10 ? `0${n}` : n)).join('-')
	const timeFormatted = [date.getHours(), date.getMinutes()]
		.map(n => (n < 10 ? `0${n}` : n))
		.join(':')

	return `${dateFormatted}T${timeFormatted}`
}
