import conditionSeed from "./conditions.seed";
import abilityAndSkills from "./abilityScoreAndSkills.seed";
import langsAndRaces from "./languagesAndRaces.seed";
import classes from "./class.seed";

export default function() {
  classes();
  console.log(
    "call the functions of the information you would like to seed here.",
    __filename
  );
}
