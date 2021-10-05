import gql from 'graphql-tag'

export default gql`
{
	user {
		authenticated
		name
		pronouns
	}
}
`
