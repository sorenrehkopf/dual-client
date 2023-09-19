import gql from 'graphql-tag'

export default gql`
{
	resources {
		name
		description
		address
		lat
		lon
	}
}
`
