import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const createClass = abilityScores => `
MATCH (b:AbilityScore)
WHERE b.shortName IN [${abilityScores}]
MERGE (a:Class{name:$name, hitDie: $hitDie})
MERGE (a) - [:SAVES_WITH] -> (b)
return a, b;
`;

const classes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Classes.json")).toString()
);

export default function(): void {
  const reducer = (accu, curr, i) => {
    if (i === 0) {
      return `'${curr.name}'`;
    }
    return `${accu}, '${curr.name}'`;
  };
  classes.map((pClass): void => {
    const savingThrowNames = pClass["saving_throws"].reduce(reducer, "");
    const createParams = {
      name: pClass.name,
      hitDie: pClass.hit_die
    };
    const session = driver.session();
    session
      .run(createClass(savingThrowNames), createParams)
      .then(res => session.close())
      .catch(err => console.error("Couldn't create class: ", err));
  });
}
