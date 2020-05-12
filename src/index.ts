import * as fs from "fs";
import * as path from "path";

import express from "express";
import cors from "cors";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { ApolloServer } from "apollo-server-express";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import neo4j from "neo4j-driver";

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
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
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
