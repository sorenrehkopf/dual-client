import gql from 'graphql-tag'

export default gql`
	mutation addResource ($name: String!, $description: String!, $address: String!, $lat: Float!, $lon: Float!) {
		addResource (name: $name, description: $description, address: $address, lat: $lat, lon: $lon) {
			name
			description
			lat
			lon
			distance
		}
	}
`
