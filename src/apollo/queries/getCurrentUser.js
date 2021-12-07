import gql from 'graphql-tag'

export default gql`
{
	currentUser {
		authenticated
		name
		email
	}
}
`
