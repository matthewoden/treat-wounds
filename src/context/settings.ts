import { createContext, useContext } from "react"

type SettingsContext = {
  settings: Settings,
  setSettings: (newSettings: Settings) => void
}

export const defaultSettings: Settings = {
  riskySurgery: false,
  magicHands: false,
  medicArchetype: false,
  mortalHealing: false,
  aidFailureAsSuccess: false
}

export const settingsStringMapping: Record<keyof Settings, string> = {
  riskySurgery: 'Risky Surgery',
  magicHands: 'Magic Hands',
  medicArchetype: 'Medic Archetype',
  mortalHealing: 'Mortal Healing',
  aidFailureAsSuccess: 'Aid: Failure as Success'
}


export const SettingsContext = createContext<SettingsContext>({ settings: defaultSettings, setSettings: () => {} })
export const useSettings = () => useContext(SettingsContext)

