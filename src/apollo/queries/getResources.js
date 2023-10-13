import gql from 'graphql-tag'

export default gql`
query getResources($lat: Float, $lon: Float, $bounds: GeoBounds){
	resources(lat: $lat, lon: $lon, bounds: $bounds) {
		name
		description
		address
		lat
		lon
		distance
	}
}
`
