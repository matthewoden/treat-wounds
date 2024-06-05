import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import React from "react"

type RadioOption<T> = { label: string, value: T }

type RadioGroupProps<T> = {
  id: string
  label: string
  options: RadioOption<T>[]
  onChange: (value: T) => void
  value: T
}


const ProficiencyRadio = <T, >(props: RadioGroupProps<T>) => {
  return (
    <FormControl>
        <FormLabel id={props.id} sx={{textAlign: "left"}}>{props.label}</FormLabel>
        <RadioGroup
          aria-labelledby={props.id}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value as T)}
          name="target-dc"
          row
        > {props.options.map((option) => (
            <FormControlLabel
              key={option.value as React.Key}
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
