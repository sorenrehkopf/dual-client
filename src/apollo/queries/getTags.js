import gql from 'graphql-tag'

export default gql`
query getTags {
	tags {
		id
		name
	}
}
`
