import { useState } from "react";
import { defaultSettings, SettingsContext } from "../context/settings";
import { getLocalState, saveLocalState } from "../localstorage";

const LOCAL_STORAGE = 'settings.v1'


const SettingsProvider = ({children}: React.PropsWithChildren) => {
  const [settings, setSettings] = useState(getLocalState(LOCAL_STORAGE, defaultSettings))
  const handleUpdateSettings = (nextSettings: Settings) => {
    saveLocalState(LOCAL_STORAGE, nextSettings)
    setSettings(nextSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings: handleUpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
