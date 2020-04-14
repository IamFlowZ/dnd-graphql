import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const CREATE_TRAIT = `
CREATE (b:Trait{name:$name, description: $desc})
WITH b
MATCH (a:Race)
WHERE a.name IN $races
CREATE (a) - [:HAS_TRAIT] -> (b)
`;

const traits = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./sources/Traits.json")).toString()
);

export default function () {
  traits.map((trait) => {
    driver
      .session()
      .run(CREATE_TRAIT, {
        races: trait.races.reduce((accu, curr, i) => {
          accu.push(curr.name);
          return accu;
        }, []),
        name: trait.name,
        desc: trait.desc,
      })
      .then((res) => console.log(res.summary.query.parameters))
      .catch((err) => console.error(err));
  });
  // Promise.all(createTraits).catch((err) => console.error(err));
  return true;
}
