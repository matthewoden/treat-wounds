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

const treatWoundsConfig = {
  "trained": {
    dc: 15,
    criticalAid: 2,
    normal: '2d8',
    critical: '4d8'
  },
  "expert": {
    dc: 20,
    criticalAid: 2,
    normal: '2d8+10',
    critical: '4d8+10',
  },
  "master": {
    dc: 30,
    criticalAid: 3,
    normal: '2d8+30',
    critical: '4d8+30',
  },
  "legendary": {
    dc: 40,
    criticalAid: 4,
    normal: '2d8+50',
    critical: '4d8+50',
  }
}

const rollAid = (bonus: string, prof: keyof typeof treatWoundsConfig) => {
  if (bonus === "") {
    return 0
  }
  const config = treatWoundsConfig[prof]

  const result = roll(`1d20 + ${bonus}`, true) as unknown as RollResultDetail
  if (result.details[0].value === 1) {
    return -1
  }

  if (result.details[0].value === 20 || result.total >= 25) {
    return config.criticalAid
  }

  return 1
}



const rollMedicine = (bonus: string, aid: number, target: keyof typeof treatWoundsConfig): number => {
  if (bonus === "") {
    return 0
  }

  const aidOperator = aid > 0 ? '+' : '-'

  const check = roll(`1d20+${bonus}${aidOperator}${aid}`, true) as unknown as RollResultDetail

  const config = treatWoundsConfig[target]

  if (check.details[0].value === 1) {
    return roll(`-1d8`) as number
  }

  if (check.details[0].value === 20 || check.total >= (config.dc + 10)) {
    return roll(config.critical) as number
  }

  return roll(config.normal) as number
}


function App() {
  const [health, setHealth] = useState(0)
  const [log, setLog] = useState<number[]>([])
  const [bonusToAid, setBonusToAid] = useState("")
  const [aidProf, setAidProf] = useState<keyof typeof treatWoundsConfig>("trained")
  const [bonusToMed, setBonusToMed] = useState("")
  const [target, setTarget] = useState<keyof typeof treatWoundsConfig>("trained")

  const handleRoll = () => {
    const aidBonus = rollAid(bonusToAid, aidProf)
    const healing = rollMedicine(bonusToMed, aidBonus, target)
    setHealth(healing)
    setLog(log.concat(healing))
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
                onChange={(event) => setAidProf(event.target.value as keyof typeof treatWoundsConfig)}
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
                value={target}
                onChange={(event) => setTarget(event.target.value as keyof typeof treatWoundsConfig)}
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
          <Box display={'flex'} flexDirection={'column'} paddingLeft={3} paddingTop={3}>
            <Typography variant="h5" sx={{fontWeight: 700}}>Health:</Typography>
            <Box display={'flex'} flexDirection={'row'} gap={1}>
              <Typography variant="h4">{health}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider/>
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} paddingTop={3}>
          <Typography variant="h6" sx={{fontWeight: 700}}>Log</Typography>
          <Button onClick={() => setLog([])}>Reset</Button>
          </Box>
          <List sx={{  transform: 'rotate(180deg)'}}>
            {log.map((result, index) => {
            return (
            <ListItem key={`${index}_${result}`} disablePadding sx={{transform: 'rotate(-180deg)'}}>
                <ListItemText
                  primary={result}
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
