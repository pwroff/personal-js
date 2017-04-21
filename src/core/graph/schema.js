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
        answers: (root, args, context) => {
            return new Promise((resolve, reject) => {
                read('./answers.json').then((raw) => {
                    console.log(context.request.headers);

                    return resolve({
                        answers: raw
                    });
                })

            })


        },
    },
    Mutation: {
        submitToken: (_, {token}, ctx) => {
            return new Promise((resolve, reject) => {
                read('./answers.json').then((raw) => {
                    const data = JSON.parse(raw);
                    const isValid = global.tokens.indexOf(token) > -1;

                    if (!isValid) {
                        return resolve({
                            isValid,
                            isAnswered: false,
                            message: 'Sign in with your access token.'
                        });
                    }

                    let isAnswered = !!data[token];
                    let message = 'Please answer questions';

                    if (isAnswered) {
                        message = 'Thank you for your answers!';
                    }

                    return resolve({
                        isValid,
                        isAnswered,
                        message
                    });
                })

            })

        },
        submitAnswers: (root, { token, answer }, context) => {
            return new Promise((resolve, reject) => {
                read('./answers.json').then((raw) => {
                    const data = JSON.parse(raw);
                    const an = JSON.parse(answer);
                    data[token] = {
                        token,
                        answer: an,
                        createdAt: Date.now()
                    };
                    write('./answers.json', JSON.stringify(data, null, 4)).then(()=>{
                        return resolve({
                            token,
                            answer,
                            state: {
                                isAnswered: true,
                                message: 'Thank you for your answers!',
                                isValid: true
                            }
                        });
                    });

                })
            });
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
