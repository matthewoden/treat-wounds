import { useState } from 'react'
import './App.css'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import roll from './diceroller'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'


interface RollInstruction {
  id: number,
  modifier: number,
  numberOfDiceToRoll: number,
  diceType: DiceTypeInput,
  timesToReroll: number
}

interface RollResultDetail {
  total: number,
  instructions: RollInstruction[],
  details: RollDetail[]
}

interface RollDetail {
  id: number,
  instructionId: number,
  modifier: number,
  diceType: DiceTypeInput,
  numberOfDiceToRoll: number,
  value: number
}

type DiceTypeInput = number | 'F'

type AbilityCheckConfig = {
  dc: number
  criticalSuccess: () => number,
  success: () => number,
  failure: () =>number,
  criticalFailure: () => number,
}

type Result = 'Success' | 'Failure' | 'Critical Success' | 'Critical Failure'
type AbilityCheckOutcome = {
  result: Result,
  value: number,
  d20Result: number,
  modifier: number,
  bonus: number,
  total: number
}

type Proficiency = 'trained' | 'expert' | 'master' | 'legendary'

// TODO: rewrite the roller logic.
const treatWoundsConfig: Record<Proficiency, AbilityCheckConfig> = {
  "trained": {
    dc: 15,
    criticalSuccess: () => roll('4d8') as number,
    success:  () => roll('2d8') as number,
    failure: () => 0,
    criticalFailure: () => roll('-1d8') as number
  },
  "expert": {
    dc: 20,
    criticalSuccess: () => roll('4d8+10') as number,
    success:  () => roll('2d8+10') as number,
    failure: () => 0,
    criticalFailure: () => roll('-1d8') as number
  },
  "master": {
    dc: 30,
    criticalSuccess: () => roll('4d8+30') as number,
    success:  () => roll('2d8+30') as number,
    failure: () => 0,
    criticalFailure: () => roll('-1d8') as number
  },
  "legendary": {
    dc: 40,
    criticalSuccess: () => roll('4d8+50') as number,
    success:  () => roll('2d8+50') as number,
    failure: () => 0,
    criticalFailure: () => roll('-1d8') as number
  }
}


const aidConfig: Record<Proficiency, AbilityCheckConfig>  = {
  "trained": {
    dc: 15,
    criticalSuccess: () => 2,
    success: () => 1,
    failure: () => 0,
    criticalFailure: () => -1
  },
  "expert": {
    dc: 15,
    criticalSuccess: () => 2,
    success: () => 1,
    failure: () => 0,
    criticalFailure: () => -1
  },
  "master": {
    dc: 15,
    criticalSuccess: () => 3,
    success: () => 1,
    failure: () => 0,
    criticalFailure: () => -1
  },
  "legendary": {
    dc: 15,
    criticalSuccess: () => 4,
    success: () => 1,
    failure: () => 0,
    criticalFailure: () => -1
  }
}

const configMap = {
  "trained": {
    dc: 15,
    criticalAid: 2,
    normalHeal: '2d8',
    criticalHeal: '4d8'
  },
  "expert": {
    dc: 20,
    criticalAid: 2,
    normalHeal: '2d8+10',
    critical: '4d8+10',
  },
  "master": {
    dc: 30,
    criticalAid: 3,
    normalHeal: '2d8+30',
    criticalHeal: '4d8+30',
  },
  "legendary": {
    dc: 40,
    criticalAid: 4,
    normalHeal: '2d8+50',
    criticalHeal: '4d8+50',
  }
}

const withOperator = (value: number) => value > 0 ? `+${value}`: `${value}`


const abilityCheck = (modifier: number, bonus: number, config: AbilityCheckConfig): AbilityCheckOutcome => {

  const check = roll(`1d20${withOperator(modifier)}${withOperator(bonus)}`, true) as unknown as RollResultDetail
  const d20Result = check.details[0].value


  const outcomes: {result: Result, value: number }[] = [{
    result: 'Critical Failure',
    value: config.criticalFailure()
  },
  {
    result: 'Failure',
    value: config.failure()
  },
  {
    result: 'Success',
    value: config.success()
  },
  {
    result: 'Critical Success',
    value: config.criticalSuccess()
  }]

  let score = 0

  if (check.total > config.dc) {
    score = 2
  } else {
    score = 1
  }

  if (check.total > config.dc + 10) {
    score = score + 1
  }

  if (check.total < config.dc - 10) {
    score = score - 1
  }

  if (d20Result === 1) {
    score = score - 1
  }

  if (d20Result === 20) {
    score = score + 1
  }

  score = Math.min(Math.max(score, 0), 3)

  return {
    d20Result,
    modifier,
    bonus,
    total: check.total,
    ...outcomes[score],
  }
}


function App() {
  const [health, setHealth] = useState<AbilityCheckOutcome | null>(null)
  const [log, setLog] = useState<AbilityCheckOutcome[]>([])
  const [bonusToAid, setBonusToAid] = useState("")
  const [aidProf, setAidProf] = useState<Proficiency>("trained")
  const [bonusToMed, setBonusToMed] = useState("")
  const [medProf, setMedProf] = useState<Proficiency>("trained")

  const handleRoll = () => {
    const aidOutcome = abilityCheck(parseInt(bonusToAid), 0, aidConfig[aidProf])
    const healingOutcome = abilityCheck(parseInt(bonusToMed), aidOutcome.value, treatWoundsConfig[medProf])

    setHealth(healingOutcome)
    setLog(log.concat(healingOutcome))
  }


  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} width={650} flexDirection={'column'} gap={0}>
        <Typography variant="h4" sx={{fontWeight: 700, marginBottom: 2, marginTop: 1}}>Treat Wounds</Typography>
        <Divider/>
        <Box display={'flex'} flexDirection={'row'} gap={1} >
          {/* Form */}
          <Box
            width={420}
            display="flex"
            alignItems="flex-start"
            flexDirection={'column'}
            gap={2}
            paddingRight={3}
            paddingTop={3}
          >
            <TextField
              InputLabelProps={{ shrink: true }}
              InputProps={{ inputProps: { min: 0 } }}
              variant="filled" label="Aid Bonus"
              type="number"
              onChange={(event) => setBonusToAid(event.target.value)}
              value={bonusToAid}
            />
            <FormControl>
              <FormLabel id="aid-prof" sx={{textAlign: "left"}}>Skill Proficiency</FormLabel>
              <RadioGroup
                aria-labelledby="aid-prof"
                value={aidProf}
                onChange={(event) => setAidProf(event.target.value as keyof typeof configMap)}
                name="aid-prof"
                row

              >
                <FormControlLabel value="trained" control={<Radio />} label="Trained" />
                <FormControlLabel value="expert" control={<Radio />} label="Expert" />
                <FormControlLabel value="master" control={<Radio />} label="Master" />
                <FormControlLabel value="legendary" control={<Radio />} label="Legendary" />
              </RadioGroup>
            </FormControl>
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
            <FormControl>
              <FormLabel id="target-dc" sx={{textAlign: "left"}}>Target DC</FormLabel>
              <RadioGroup
                aria-labelledby="target-dc"
                value={medProf}
                onChange={(event) => setMedProf(event.target.value as keyof typeof configMap)}
                name="target-dc"
                row

              >
                <FormControlLabel value="trained" control={<Radio />} label="Trained" />
                <FormControlLabel value="expert" control={<Radio />} label="Expert" />
                <FormControlLabel value="master" control={<Radio />} label="Master" />
                <FormControlLabel value="legendary" control={<Radio />} label="Legendary" />
              </RadioGroup>
            </FormControl>
            <Box display="flex" justifyContent="space-between" width={"100%"} paddingBottom={2} paddingTop={3}>
              <Button variant="text" onClick={() => {
                setBonusToAid("")
                setBonusToMed("")
              }}>Reset
              </Button>
              <Button variant="contained" onClick={handleRoll} disabled={bonusToMed === ""}>Roll</Button>
            </Box>
          </Box>
          <Divider orientation="vertical" />
          {/* Output */}
          <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={3} paddingTop={3}>
            <Typography variant="h5" alignSelf={'center'} sx={{fontWeight: 700}}>Health:</Typography>
            {health && (
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant="h4" alignSelf={'center'}>{health.value}</Typography>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
                <Typography variant="overline">{health.result}</Typography>
                <Divider orientation='vertical'/>
                <Typography variant="overline">{health.total}</Typography>
              </Box>
            </Box>)
            }
          </Box>
        </Box>
        <Divider/>
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} paddingTop={3}>
          <Typography variant="h6" sx={{fontWeight: 700}}>Log</Typography>
          <Button onClick={() => setLog([])}>Reset</Button>
          </Box>
          <List sx={{  transform: 'rotate(180deg)'}}>
            {log.map((check, index) => {
            return (
            <ListItem key={`${index}_${check}`} disablePadding sx={{transform: 'rotate(-180deg)'}}>
                <ListItemText
                  primary={check.value}
                  secondary={`Roll #: ${index + 1}`}
                />
              </ListItem>
            )})}
          </List>

        </Box>
      </Box>
    </Box>
  )
}

export default App
