import gql from 'graphql-tag'

export default gql`
query getResources($lat: Float, $lon: Float){
	resources(lat: $lat, lon: $lon) {
		name
		description
		address
		lat
		lon
		distance
	}
}
`
