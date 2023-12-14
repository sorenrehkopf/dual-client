import gql from 'graphql-tag'

export default gql`
	mutation addResource ($name: String!, $description: String!, $address: String!, $lat: Float!, $lon: Float!, $tags: [String], $schedule: [AvailabilityInput]) {
		addResource (name: $name, description: $description, address: $address, lat: $lat, lon: $lon, tags: $tags, schedule: $schedule) {
			name
			description
			lat
			lon
			distance
			tags {
				name
			},
			schedule {
				startDatetime
				endDatetime
				weekday
				startTime
				endTime
			}
		}
	}
`
