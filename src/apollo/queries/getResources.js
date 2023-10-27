import gql from 'graphql-tag'

export default gql`
query getResources($lat: Float, $lon: Float, $bounds: GeoBounds, $tags: [String], $open: [String]){
	resources(lat: $lat, lon: $lon, bounds: $bounds, tags: $tags, open: $open) {
		id
		name
		description
		address
		lat
		lon
		distance
		tags {
			id
			name
		}
	}
}
`
