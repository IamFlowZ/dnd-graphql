import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
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

export default async function () {
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
