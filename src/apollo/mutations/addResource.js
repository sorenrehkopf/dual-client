import gql from 'graphql-tag'

export default gql`
	mutation addResource ($name: String!, $description: String!, $address: String!, $lat: Float!, $lon: Float!, $tags: [String]) {
		addResource (name: $name, description: $description, address: $address, lat: $lat, lon: $lon, tags: $tags) {
			name
			description
			lat
			lon
			distance
			tags {
				name
			}
		}
	}
`
