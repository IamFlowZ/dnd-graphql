import * as fs from "fs";
import * as path from "path";

import {config} from "dotenv"
import express from "express";
import cors from "cors";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { ApolloServer } from "apollo-server-express";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import neo4j from "neo4j-driver";

config()

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

const modifiedSchema = makeAugmentedSchema({
  typeDefs: fs
    .readFileSync(path.join(__dirname, "./schema.graphql"))
    .toString(),
  config: {
    query: true,
    mutation: false,
  },
});

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass)
);

const server = new ApolloServer({
  schema: modifiedSchema,
  context: { driver },
  introspection: true,
  playground: true,
  subscriptions: false,
});

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.redirect("/graphql");
});
app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log("Listening on port 4000");
});
