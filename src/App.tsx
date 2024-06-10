import { useState } from 'react'
import './App.css'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Form from './components/Form'
import { HealthOutcome } from './components/Health'
import Log from './components/Log'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { useSettings } from './context/settings'
import SettingsDrawer from './components/SettingsDrawer'
import { getLocalState, saveLocalState } from './localstorage'

const LOCAL_STORAGE = 'log.v1'
const defaultLog: ActivityEvent<TreatWoundsCheck>[] = []
const initialState = getLocalState(LOCAL_STORAGE, defaultLog).reverse()

function App() {
  const [activityLog, setActivityLog] = useState<ActivityEvent<TreatWoundsCheck>[]>(initialState)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const {settings} = useSettings()

  const outcome = activityLog[activityLog.length - 1]?.outcome ?? null

  const handleSubmit = (healingOutcome: AbilityCheckOutcome<TreatWoundsCheck>) => {
    const nextLog = activityLog.concat([{ outcome: healingOutcome, settings }])
    const lastTen = [...nextLog].reverse().slice(0, 10)

    setActivityLog(nextLog)
    saveLocalState(LOCAL_STORAGE, lastTen)
  }

  const handleClearLog = () => {
    setActivityLog([])
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <Box
      flexGrow={1}
      justifyContent={'center'}
      flexDirection={'column'}
      sx={{flexGrow: 1}}
      maxWidth={1000}
      minWidth={800}
      margin={'auto'}
    >
      <Paper elevation={0}>
        <AppBar position={'fixed'} />
        <Toolbar>
          <Typography variant='h6' component={'div'} sx={{flexGrow:1}}> Treat Wounds</Typography>
          <IconButton size="large" edge={"start"} color={'inherit'} onClick={toggleDrawer} >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
        <SettingsDrawer open={drawerOpen} onClose={toggleDrawer} />
        <Box display={'flex'} flexGrow={1} paddingLeft={3} paddingRight={3}>
          <Box display={'flex'} width={"100%"} flexDirection={'column'}>
            <Divider/>
            <Box display={'flex'} flexDirection={'row'}>
              <Form onSubmit={handleSubmit}/>
              <Divider orientation="vertical" />
              <HealthOutcome outcome={outcome}/>
            </Box>
            <Divider/>
            <Box>
            <Log activities={activityLog} onClear={handleClearLog} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default App
