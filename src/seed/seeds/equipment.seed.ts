import fs from "fs";
import path from "path";
import neo4j from "neo4j-driver";

const graphenedbURL =
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost:7687";
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "neo4j";
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "letmein";

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass),
  { encrypted: process.env.NODE_ENV === "production" }
);

const categories = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/EquipmentCategories.json"))
    .toString()
);
const equipment = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Equipment.json")).toString()
);

const currencies = {
  cp: "Copper",
  gp: "Gold",
  sp: "Silver",
  ep: "Electrum",
  pp: "Platinum",
};

/*
All equipment is guaranteed to have a name. After that, all other properties are determined by the subcategory.
*/
// need to map the subcategories to figure out what properties they, so I can write queries that contain the right properties.

async function createEquipment() {
  const createEquipment = categories.map(async (category) => {
    const fullEquipmentList = category.equipment.map(
      (item) => equipment.filter((fullItem) => fullItem.name === item.name)[0]
    );
    fullEquipmentList.map(async (completeItem) => {
      const session = driver.session();
      await session.run(
        `MATCH (b:Currency{name:$currency})
         CREATE (a:Equipment:${category.name}{name:$name, weight: $weight, description: $desc}),
         (a) - [:COSTS{amount:$amount}] -> (b)`,
        {}
      );
      await session.close();
      return true;
    });
  });
  await Promise.all(createEquipment).catch((err) => console.error(err));
  return true;
}

export default createEquipment;
