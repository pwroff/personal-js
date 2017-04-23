/**
 * Created by Leonid on 23/04/17.
 */

const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');
function identity(value) {
    return value;
}
function parseLiteral(ast) {
    switch (ast.kind) {
        case Kind.STRING:
        case Kind.BOOLEAN:
            return ast.value;
        case Kind.INT:
        case Kind.FLOAT:
            return parseFloat(ast.value);
        case Kind.OBJECT: {
            const value = Object.create(null);
            ast.fields.forEach((field) => {
                value[field.name.value] = parseLiteral(field.value);
            });
            return value;
        }
        case Kind.LIST:
            return ast.values.map(parseLiteral);
        default:
            return null;
    }
}
module.exports = new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON Scalar type',
    serialize: identity,
    parseValue: identity,
    parseLiteral
});
