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

(async () => {
  // await abilityAndSkills();
  // await classes();
  // await conditionSeed();
  // await langsAndRaces();
  // await weaponProperties();
  // await dmgTypes();
  // await profs();
  // await subclass();
  // await subrace();
  // await trait();
})().then((res) => console.log("done"));

console.log(
  "call the functions of the information you would like to seed here.\n",
  __filename
);
