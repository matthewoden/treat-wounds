import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { abilityCheck, AbilityCheckOutcome, aidConfig, Proficiency, treatWoundsConfig } from "../diceroller/checks"
import ProficiencyRadio from "./RadioGroup"

type FormProps = {
  onSubmit: (outcome: AbilityCheckOutcome) => void
}

const Form = (props: FormProps) => {
  const [bonusToAid, setBonusToAid] = useState("")
  const [aidProf, setAidProf] = useState<Proficiency>("trained")
  const [bonusToMed, setBonusToMed] = useState("")
  const [medProf, setMedProf] = useState<Proficiency>("trained")

  const handleReset = () => {
    setBonusToAid("")
    setBonusToMed("")
  }

  const handleSubmit = () => {
    const aidOutcome = abilityCheck(parseInt(bonusToAid), 0, aidConfig[aidProf])
    console.log(aidOutcome)
    const healingOutcome = abilityCheck(parseInt(bonusToMed), aidOutcome.value, treatWoundsConfig[medProf])

    props.onSubmit(healingOutcome)
  }

  return (
    <Box
      width={420}
      display="flex"
      alignItems="flex-start"
      flexDirection={'column'}
      gap={2}
      paddingTop={3}
      paddingRight={2}
      paddingBottom={2.5}
    >
      <TextField
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0 } }}
        variant="filled" label="Aid Bonus"
        type="number"
        onChange={(event) => setBonusToAid(event.target.value)}
        value={bonusToAid}
      />
      <ProficiencyRadio id="aid-prof" onChange={setAidProf} value={aidProf} label={"Skill Proficiency"}/>
      <br />
      <TextField
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0 } }}
        onChange={(event) => setBonusToMed(event.target.value)}
        value={bonusToMed}
        variant="filled"
        type="number"
        label="Medicine Bonus"
      />
      <ProficiencyRadio id="target-dc" onChange={setMedProf} value={medProf} label={"Target DC"}/>
      <Box
        display="flex"
        justifyContent="space-between"
        width={"100%"}
        paddingTop={1}
      >
        <Button variant="text" onClick={handleReset} sx={{marginLeft:-1}}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={bonusToMed === ""}
        >
          Roll
        </Button>
      </Box>
    </Box>
  )
 }
export default Form
