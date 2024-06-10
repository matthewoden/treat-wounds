import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { settingsStringMapping } from "../context/settings";
import SettingsIcon from "@mui/icons-material/SettingsTwoTone";
import Divider from "@mui/material/Divider";
import Tooltip from '@mui/material/Tooltip';

type LogProps = {
  activities: ActivityEvent<TreatWoundsCheck>[]
  onClear: () => void
}

const SettingsDisplay = ({settings}: { settings: Settings }) => {
  const keys = Object.keys(settings) as Array<keyof Settings>
  const sortedKeys = keys.filter(setting => settings[setting]).sort()
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Typography variant="body1" component="div" fontWeight={700}>
        Settings:
      </Typography>
      {sortedKeys.map((setting) => (
        <Typography key={setting} marginTop={1}>
          {settingsStringMapping[setting]}
        </Typography>
      ))}
    </Box>
  )
}

const Label = (props: React.PropsWithChildren) =>
  <Typography variant="overline" component={'span'} color={"text.secondary"}>{props.children}</Typography>

const Log = (props: LogProps) => {
  return (
    <Box paddingTop={2}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant="h6" sx={{fontWeight: 700}}>Log</Typography>
        <Button onClick={() => props.onClear()}>Reset</Button>
      </Box>
      <List sx={{  transform: 'rotate(180deg)'}}>
        {props.activities.map(({outcome, settings}, index) => {
          return (
            <React.Fragment key={`${index}_${outcome.total}`}>
              <ListItem disablePadding sx={{transform: 'rotate(-180deg)', paddingTop: 1}} >
                  <ListItemText
                    primary={(
                      <Box component={'span'} display={'flex'} flexDirection={'row'} gap={1}>
                        <Label>Roll #{index + 1}:</Label>
                        <Typography
                          component={"span"}
                          variant="body1"
                        >
                          {outcome.value.healing} <Label>Heal</Label>
                        </Typography>
                        {outcome.value.harm !== 0 && (
                          <>
                            <Label>
                            |
                            </Label>
                            <Typography
                              component={"span"}
                              variant="body1"
                              >
                              {Math.abs(outcome.value.harm)} <Label>Harm</Label>
                            </Typography>
                            <Label>
                            |
                            </Label>
                            <Typography
                              component={"span"}
                              variant="body1"
                              >
                              {outcome.value.net} <Label>Net</Label>
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                    secondary={(
                      <Box component={'span'}>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body1"
                          color={'text.primary'}
                        >
                          {outcome.d20Result} <Label>Roll + </Label> {outcome.modifier} <Label>Mod +</Label> {outcome.bonus} <Label>Bonus =</Label> {outcome.total} <Label>{outcome.result}</Label>
                        </Typography>
                      </Box>
                    )}
                  />
                  <Tooltip placement="right" title={<SettingsDisplay settings={settings}/>}>
                    <Typography color={"text.secondary"} component={"div"}>
                      <SettingsIcon color={"inherit"} fontSize="small" cursor={'pointer'} />
                    </Typography>
                  </Tooltip>
              </ListItem>
              {index + 1 !== props.activities.length && <Divider/> }
            </React.Fragment>
        )})}
      </List>
    </Box>
  )
}

export default Log
