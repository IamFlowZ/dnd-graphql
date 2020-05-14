import fs from "fs";
import path from "path";

const CREATE_TRAIT = `
CREATE (b:Trait{name:$name, description: $desc})
WITH b
MATCH (a:Race)
WHERE a.name IN $races
CREATE (a) - [:HAS_TRAIT] -> (b)
`;

const traits = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Traits.json")).toString()
);

async function createTraits(driver) {
  const createTraits = traits.map(async (trait) => {
    const session = driver.session();
    await session.run(CREATE_TRAIT, {
      races: trait.races.reduce((accu, curr) => {
        accu.push(curr.name);
        return accu;
      }, []),
      name: trait.name,
      desc: trait.desc,
    });
    await session.close();
    return true;
  });
  await Promise.all(createTraits);
  await driver.close();
  return true;
}

export default createTraits;
