import gql from 'graphql-tag'

export default gql`
	query user {
		authenticated
		name
		pronouns
	}
`
