export const getShortDateDisplay = date => {
	const day = date.getDate()
	const month = date.getMonth()
	const year = String(date.getFullYear()).substr(2)
	const hour = date.getHours()
	const minute = date.getMinutes()
	const ampm = hour > 12 ? 'PM' : 'AM'

	return `${day}/${month}/${year}, ${hour % 12}:${minute} ${ampm}`
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
