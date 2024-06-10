import { settingsStringMapping, useSettings } from "../context/settings"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Checkbox from "@mui/material/Checkbox"
import ListItemText from "@mui/material/ListItemText"
import Drawer from "@mui/material/Drawer"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import Box from "@mui/material/Box"


type SettingsDrawerProps = {
  open: boolean
  onClose: () => void
}

const SettingsDrawer = (props: SettingsDrawerProps) => {
  const {settings, setSettings} = useSettings()
  const updateSetting = (setting: keyof Settings) => setSettings({...settings, [setting]: !settings[setting]})
  const settingKeys = Object.keys(settings).sort() as Array<keyof Settings>
  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <Typography variant="h6" padding={2}>Settings</Typography>
      <Divider/>
      <Box marginTop={3}>
        <List>
          {settingKeys.map((setting) => (
            <ListItem
              key={setting}
              disablePadding
            >
              <ListItemButton role={undefined} onClick={() => updateSetting(setting)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={settings[setting]}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': setting}}
                  />
                </ListItemIcon>
                <ListItemText id={setting} primary={settingsStringMapping[setting]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default SettingsDrawer
