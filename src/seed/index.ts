import conditionSeed from "./conditions.seed";
import abilityAndSkills from "./abilityScoreAndSkills.seed";
import langsAndRaces from "./languagesAndRaces.seed";
import subrace from "./subraces.seed";
import trait from "./traits.seed";
import classes from "./class.seed";
import subclass from "./subclass.seed";
import weaponProperties from "./weaponProperties.seed";
import dmgTypes from "./damageTypes.seed";
import profs from "./proficencies.seed";

(async () => {
  // await conditionSeed();
  // await abilityAndSkills();
  // await langsAndRaces();
  // await classes();
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
