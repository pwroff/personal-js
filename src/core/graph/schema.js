/**
 * Created by Leonid on 12/04/17.
 */
const { makeExecutableSchema } = require('graphql-tools');
const {init, read, write} = require('./db');
init().then((tkns) => {
    global.tokens = tkns;
    if (global.ontokens) {
        ontokens(tokens);
    }
});
const rootSchema = [`
type Answer {
  answer: String
  token: String
  createdAt: Float
}
type Query {
  answers: [Answer]
}

type Mutation {
  submitAnswers(
    token: String!,
    answer: String!
  ): Answer
}
schema {
  query: Query
  mutation: Mutation
}
`];

const rootResolvers = {
    Query: {
        answers: async(root, args, context) => {
            const raw = await read('./answers.json');
            const {data} = JSON.parse(raw);
            return data.map((a) => {
                const {token, answer: an} = a;

                return {
                    token,
                    answer: JSON.stringify(an, null, 4)
                }
            });
        },
    },
    Mutation: {
        submitAnswers: async(root, { token, answer }, context) => {
            const raw = await read('./answers.json');
            const {data} = JSON.parse(raw);
            const an = JSON.parse(answer);
            data.push({
                token,
                answer: an,
                createdAt: Date.now()
            });
            await write('./answers.json', JSON.stringify({
                data
            }, null, 4));
            return {
                token,
                answer
            };
        }
    }
};

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = rootSchema;
const resolvers = rootResolvers;

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
});

module.exports = executableSchema;
