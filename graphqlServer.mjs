
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import path from "node:path";
import fileHelpers from "./fileHelpers.js";
const { readTable } = fileHelpers;
const fileName = path.join(process.cwd(), "data", "emp.txt");
const typeDefs = `#graphql
    type Employee {
        id: ID!
        name: String!
        age: Int!
        city: String!
        state: String!
        county: String!
    }

    type Query {
        employees: [Employee!]!
        employee(id: ID!): Employee
    }
`;
const resolvers = {
    Query: {
        employees: () => {
            const rows = readTable(fileName);

            return rows.map((row) => ({
                id: row[0],
                name: row[1],
                age: Number(row[2]),
                city: row[3],
                state: row[4],
                county: row[5]
            }));
        },
        employee: (_, args) => {
            const rows = readTable(fileName);
            const row = rows.find(
                (item) => item[0] === String(args.id)
            );

            if (!row) {
                return null;
            }

            return {
                id: row[0],
                name: row[1],
                age: Number(row[2]),
                city: row[3],
                state: row[4],
                county: row[5]
            };
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log(`GraphQL server running at ${url}`);