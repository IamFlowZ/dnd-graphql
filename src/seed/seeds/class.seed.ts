import fs from "fs";
import path from "path";

const createClass = `
MATCH (b:AbilityScore)
WHERE b.shortName IN $abilityScores
MERGE (a:Class{name:$name, hitDie: $hitDie})
MERGE (a) - [:SAVES_WITH] -> (b)
return a, b;
`;

const classes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Classes.json")).toString()
);

async function createClasses(driver) {
  const reducer = (accu, curr) => {
    accu.push(curr.name);
    return accu;
  };
  const createClasses = classes.map(async (pClass) => {
    const createParams = {
      abilityScores: pClass.saving_throws.reduce(reducer, []),
      name: pClass.name,
      hitDie: pClass.hit_die,
    };
    const session = driver.session();
    const results = await session.run(createClass, createParams);
    console.log(results);
    await session.close();
    return true;
  });
  await Promise.all(createClasses).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createClasses;
