import {ApolloServer, gql} from 'apollo-server-micro'
import * as resolvers from './resolvers'

const typeDefs = gql`
  scalar Date
  
  type Project {
    id: Int!
    name: String!
    description: String!
    icon_url: String!
    users: [User!]!
    created_ts: Date
    updated_ts: Date
  }

  type User {
    id: Int!
    name: String!
    bio: String!
    avatar_url: String!
    fellowship: String!
    projects: [Project!]!
    created_ts: Date
    updated_ts: Date
  }
  
  type NewsFeed { 
    id: Int!
    title: String!
    description: String!  
    fellowship: String
    type: String!
    created_ts: Date
    updated_ts: Date
  }

  type Query {
    project(id: Int!): Project!
    user(id: Int!): User!
    newsfeed(filter: String!, limit:Int!, offset: Int!): NewsFeedPayload
  }

  type NewsFeedPayload {
    newsfeed: [NewsFeed],
    hasNextPage: Boolean
  }
`;

export const server = new ApolloServer({typeDefs, resolvers})
