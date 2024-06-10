import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { abilityCheck } from "../diceroller/checks"
import ProficiencyRadio from "./ProficiencyRadio"
import Typography from "@mui/material/Typography"
import { createTreateWoundsConfig, createTreatWoundsRollMapping } from "../diceroller/checks/treatWounds"
import { useSettings } from "../context/settings"
import { aidConfig, createAidRollMapping } from "../diceroller/checks/aid"
import { getLocalState, saveLocalState } from "../localstorage"

type FormProps = {
  onSubmit: (outcome: AbilityCheckOutcome<TreatWoundsCheck>) => void
}

type FormState = {
  aidBonus: string,
  staticBonus: string,
  aidProf: Proficiency,
  bonusToMed: string,
  medProf: Proficiency
}

const defaultFormState: FormState = {
  aidBonus: "",
  staticBonus: "",
  aidProf: "trained",
  bonusToMed: "",
  medProf: "trained",
}

const LOCAL_STORAGE = 'form.v1'

const initialState = getLocalState(LOCAL_STORAGE, defaultFormState)

const Form = (props: FormProps) => {

  const [aidBonus, setAidBonus] = useState(initialState.aidBonus)
  const [staticBonus, setStaticBonus] = useState(initialState.staticBonus)
  const [aidProf, setAidProf] = useState<Proficiency>(initialState.aidProf)
  const [bonusToMed, setBonusToMed] = useState(initialState.bonusToMed)
  const [medProf, setMedProf] = useState<Proficiency>(initialState.medProf)
  const { settings } = useSettings()

  const handleReset = () => {
    setMedProf("trained")
    setAidProf("trained")
    setAidBonus("")
    setBonusToMed("")
  }

  const handleSubmit = () => {
    let bonusValue = 0

    if (aidBonus !== "") {

      bonusValue += abilityCheck(
        parseInt(aidBonus, 10),
        0,
        aidConfig[aidProf],
        createAidRollMapping(settings)
      ).value

    }

    if (staticBonus !== "") {
      bonusValue += parseInt(staticBonus, 10)
    }

    const treatWoundsOutcomes = createTreateWoundsConfig(settings)
    const treatWoundsRollModifiers = createTreatWoundsRollMapping(settings)

    const healingOutcome = abilityCheck(
        parseInt(bonusToMed),
        bonusValue,
        treatWoundsOutcomes[medProf],
        treatWoundsRollModifiers
    )
    props.onSubmit(healingOutcome)
    saveLocalState(LOCAL_STORAGE, {
      aidBonus,
      aidProf,
      staticBonus,
      medProf,
      bonusToMed,
    })
  }

  return (
    <Box
      minWidth={420}
      width={"60%"}
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
      <TextField
        InputLabelProps={{ shrink: true }}
        InputProps={{ inputProps: { min: 0 } }}
        variant="filled" label={'Static Bonus'}
        type="number"
        onChange={(event) => setStaticBonus(event.target.value)}
        value={staticBonus}
      />
        <TextField
          InputLabelProps={{ shrink: true }}
          InputProps={{ inputProps: { min: 0 } }}
          variant="filled" label={"Aid Bonus"}
          type="number"
          onChange={(event) => setAidBonus(event.target.value)}
          value={aidBonus}
        />
        <Box display={'flex'} flexDirection={'column'} gap={0.5}>
          <ProficiencyRadio id="aid-prof" onChange={setAidProf} value={aidProf} label={"Aid Skill Proficiency"}/>
        </Box>
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
