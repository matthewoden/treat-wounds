import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { abilityCheck, AbilityCheckOutcome, aidConfig, Proficiency, treatWoundsConfig } from "../diceroller/checks"
import ProficiencyRadio from "./ProficiencyRadio"
import RadioGroup from "./RadioGroup"
import Typography from "@mui/material/Typography"

type FormProps = {
  onSubmit: (outcome: AbilityCheckOutcome) => void
}

type BonusSource = 'aid' | 'static'

const bonusSourceOptions: {label: string, value: BonusSource}[] = [{ label: "Aid", value: 'aid'}, { label: 'Static', value: 'static'}]

const Form = (props: FormProps) => {
  const [bonus, setBonus] = useState("")
  const [aidProf, setAidProf] = useState<Proficiency>("trained")
  const [bonusToMed, setBonusToMed] = useState("")
  const [medProf, setMedProf] = useState<Proficiency>("trained")
  const [bonusSource, setBonusSource] = useState("aid")

  const handleReset = () => {
    setMedProf("trained")
    setAidProf("trained")
    setBonus("")
    setBonusToMed("")
  }

  const handleSubmit = () => {
    let bonusValue = 0
    if (bonus !== "") {
      const parsedBonus = parseInt(bonus)
      bonusValue = bonusSource === 'aid' ? abilityCheck(parsedBonus, 0, aidConfig[aidProf]).value : parsedBonus
    }
    const healingOutcome = abilityCheck(parseInt(bonusToMed), bonusValue, treatWoundsConfig[medProf])

    props.onSubmit(healingOutcome)
  }

  return (
    <Box
      width={420}
      display="flex"
      alignItems="flex-start"
      flexDirection={'column'}
      gap={3}
      paddingTop={3}
      paddingRight={2}
      paddingBottom={2.5}
    >
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
      <Typography variant="h6" fontWeight={700} marginBottom={-2}>Bonuses:</Typography>
      <RadioGroup
        id="source"
        options={bonusSourceOptions}
        label={"Bonus Source"}
        value={bonusSource}
        onChange={(value) => setBonusSource(value)}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0 } }}
        variant="filled" label={bonusSource === 'aid' ? "Aid Bonus" : 'Static Bonus'}
        type="number"
        onChange={(event) => setBonus(event.target.value)}
        value={bonus}
      />
      { bonusSource === 'aid' &&
        <ProficiencyRadio id="aid-prof" onChange={setAidProf} value={aidProf} label={"Aid Skill Proficiency"}/>
      }
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
