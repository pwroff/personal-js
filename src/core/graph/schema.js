/**
 * Created by Leonid on 12/04/17.
 */
const { makeExecutableSchema } = require('graphql-tools');
const {init, read, write} = require('./db');
const JSONScalar = require('./JSONScalar');

const rootSchema = [`
scalar JSON

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
  showAnswers: Boolean
}
type Query {
  answers(token: String!): JSON
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
    JSON: JSONScalar,
    Query: {
        answers: (root, args, context) => {

            return new Promise((resolve, reject) => {

                if (tokens.indexOf(args.token) === tokens.length - 1) {
                    return read('./answers.json').then((raw) => {
                        const answers = JSON.parse(raw);
                        return resolve(answers);
                    })
                }
                return reject(new Error('Unauthorized access'));
            })


        },
    },
    Mutation: {
        submitToken: (_, {token}, ctx) => {
            return new Promise((resolve, reject) => {
                read('./answers.json').then((raw) => {
                    const data = JSON.parse(raw);
                    const isValid = global.tokens.indexOf(token) > -1;
                    const showAnswers = tokens.indexOf(token) === tokens.length - 1;

                    if (!isValid) {
                        return resolve({
                            isValid,
                            isAnswered: false,
                            message: 'Sign in with your access token.'
                        });
                    }

                    let isAnswered = !!data[token];
                    let message = 'Please answer all the questions sincerely.';

                    if (isAnswered) {
                        message = 'This piece of knowledge is very valuable. Thank you!';
                    }

                    return resolve({
                        isValid,
                        isAnswered,
                        message,
                        showAnswers
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
                                message: 'This piece of knowledge is very valuable. Thank you!',
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
