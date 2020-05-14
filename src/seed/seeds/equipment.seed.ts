import fs from "fs";
import path from "path";

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

async function createEquipment(driver) {
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
