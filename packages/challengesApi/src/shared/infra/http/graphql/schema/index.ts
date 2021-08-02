import { buildSchema } from 'graphql';

const schema = buildSchema(`
  scalar Date
  type MyType {
    create: Date
  },
  type Challenge {
    id: ID!
    title: String!
    description: String!
    created_at: Date
    updated_at: Date
  }
  type Answer {
    id: ID!
    challenge_id: String!
    challengeId: Challenge!
    repository_url: String!
    status: String!
    grade: Float
    created_at: Date
    updated_at: Date
  }
  type Query {
    challenges(title: String, description: String, take: Int, skip: Int): [Challenge!]!
    answers(challenge_id: String, date_start: Date, date_end: Date, status: String, take: Int, skip: Int): [Answer!]!
  }
  type Mutation {
    createChallenge(title: String!, description: String!): Challenge!
    updateChallenge(id: ID!, title: String, description: String): Challenge!
    deleteChallenge(id: ID!): Challenge!
    answerChallenge(challenge_id: ID!, repository_url: String!): Answer!
  }
`);

export default schema;
