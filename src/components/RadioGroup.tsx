import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { Proficiency } from "../diceroller/checks"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"

type ProficiencyRadioProps = {
  id: string
  label: string
  onChange: (value: Proficiency) => void
  value: Proficiency
}

const options: { label: string, value: Proficiency }[] = [
  {
    label: "Trained",
    value: "trained",
  },
  {
    label: "Expert",
    value: "expert",
  },
    {
    label: "Master",
    value: "master",
  },
    {
    label: "Legendary",
    value: "legendary",
  },
]

const ProficiencyRadio = (props: ProficiencyRadioProps) => {
  return (
    <FormControl>
        <FormLabel id="target-dc" sx={{textAlign: "left"}}>Target DC</FormLabel>
        <RadioGroup
          aria-labelledby="target-dc"
          value={props.value}
          onChange={(event) => props.onChange(event.target.value as Proficiency)}
          name="target-dc"
          row
        > {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
  )
}

export default ProficiencyRadio
