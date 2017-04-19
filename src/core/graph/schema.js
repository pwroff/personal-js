/**
 * Created by Leonid on 12/04/17.
 */
const { makeExecutableSchema } = require('graphql-tools');
const {init, read, write} = require('./db');
init(10).then((tkns) => {
    global.tokens = tkns;
    console.log(tokens);
    if (global.ontokens) {
        ontokens(tokens);
    }
});
const rootSchema = [`
type Answer {
  answer: String
  token: String
  createdAt: Float
  state: Apptype
}
type Apptype {
  isValid: Boolean
  isAnswered: Boolean
  message: String
}
type Query {
  answers: String
}

type Mutation {
  submitAnswers(
    token: String!,
    answer: String!
  ): Answer
  submitToken(token: String!): Apptype
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

            console.log(context.request.headers);

            return {
                answers: raw
            }
        },
    },
    Mutation: {
        submitToken: async (_, {token}, ctx) => {
            const raw = await read('./answers.json');
            const data = JSON.parse(raw);
            const isValid = global.tokens.indexOf(token) > -1;

            if (!isValid) {
                return {
                    isValid,
                    isAnswered: false,
                    message: 'Sign in with your access token.'
                }
            }

            let isAnswered = !!data[token];
            let message = 'Please answer questions';

            if (isAnswered) {
                message = 'Thank you for your answers!';
            }

            return {
                isValid,
                isAnswered,
                message
            }
        },
        submitAnswers: async(root, { token, answer }, context) => {
            const raw = await read('./answers.json');
            const data = JSON.parse(raw);
            const an = JSON.parse(answer);
            data[token] = {
                token,
                answer: an,
                createdAt: Date.now()
            };
            await write('./answers.json', JSON.stringify(data, null, 4));
            return {
                token,
                answer,
                state: {
                    isAnswered: true,
                    message: 'Thank you for your answers!',
                    isValid: true
                }
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
