import RadioGroup from "./RadioGroup"

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
    <RadioGroup {...props} options={options} />
  )
}

export default ProficiencyRadio
