import { useState } from 'react'
import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Form from './components/Form'
import { AbilityCheckOutcome } from './diceroller/checks'
import { HealthOutcome } from './components/Health'
import Log from './components/Log'

function App() {
  const [outcome, setOutcome] = useState<AbilityCheckOutcome | null>(null)
  const [outcomeLog, setOutcomeLog] = useState<AbilityCheckOutcome[]>([])

  const handleSubmit = (healingOutcome: AbilityCheckOutcome) => {
    setOutcome(healingOutcome)
    setOutcomeLog(outcomeLog.concat(healingOutcome))
  }

  const handleClearLog = () => {
    setOutcomeLog([])
  }

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} width={650} flexDirection={'column'} gap={0}>
        <Typography variant="h4" sx={{fontWeight: 700, marginBottom: 2, marginTop: 1}}>Treat Wounds</Typography>
        <Divider/>
        <Box display={'flex'} flexDirection={'row'} gap={1} >
          <Form onSubmit={handleSubmit}/>
          <Divider orientation="vertical" />
          <HealthOutcome outcome={outcome}/>
        </Box>
        <Divider/>
        <Box>
         <Log outcomes={outcomeLog} onClear={handleClearLog} />
        </Box>
      </Box>
    </Box>
  )
}

export default App
