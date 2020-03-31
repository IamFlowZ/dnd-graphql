import conditionSeed from "./conditions.seed";
import abilityAndSkills from "./abilityScoreAndSkills.seed";
import langsAndRaces from "./languagesAndRaces.seed";
import classes from "./class.seed";
import weaponProperties from "./weaponProperties.seed";
import dmgTypes from "./damageTypes.seed";
import profs from "./proficencies.seed";

export default function() {
  profs();
  console.log(
    "call the functions of the information you would like to seed here.",
    __filename
  );
}
