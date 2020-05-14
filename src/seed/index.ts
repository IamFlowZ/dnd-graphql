import abilityAndSkills from "./seeds/abilityScoreAndSkills.seed";
import classes from "./seeds/class.seed";
import conditionSeed from "./seeds/conditions.seed";
import dmgTypes from "./seeds/damageTypes.seed";
import langsAndRaces from "./seeds/languagesAndRaces.seed";
import profs from "./seeds/proficencies.seed";
import subclass from "./seeds/subclass.seed";
import subrace from "./seeds/subraces.seed";
import trait from "./seeds/traits.seed";
import weaponProperties from "./seeds/weaponProperties.seed";
import currencies from "./seeds/currency.seed";
import neo4j from "neo4j-driver";

const graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass)
);

(async () => {
  const conTest = await driver.verifyConnectivity()
  console.log(conTest)
  await abilityAndSkills(driver);
  await classes(driver);
  await conditionSeed(driver);
  await langsAndRaces(driver);
  await weaponProperties(driver);
  await dmgTypes(driver);
  await profs(driver);
  await subclass(driver);
  await subrace(driver);
  await trait(driver);
  await currencies(driver);
})().then((res) => console.log("done"));

console.log(
  "call the functions of the information you would like to seed here.\n",
  __filename
);
