import fs from "fs";
import path from "path";
import neo4j from "neo4j-driver";

const graphenedbURL =
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost:7687";
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "neo4j";
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "neo4j";

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass),
  { encrypted: process.env.NODE_ENV === "production" }
);

const createCondition = `
CREATE (a:Condition {
    name: $name,
    description: $desc
}) RETURN a
`;

const conditions = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Conditions.json")).toString()
);

async function createConditions() {
  const createConditions = conditions.map(async (condition) => {
    const session = driver.session();
    await session.run(createCondition, {
      name: condition.name,
      desc: condition.desc.reduce((accu, curr) => `${accu} ${curr}`),
    });
    await session.close();
    return true;
  });
  await Promise.all(createConditions).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createConditions;
