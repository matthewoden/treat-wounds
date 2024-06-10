type Settings = {
  riskySurgery: boolean
  magicHands: boolean
  medicArchetype: boolean
  mortalHealing: boolean
  aidFailureAsSuccess: boolean
}
// checks

type AbilityCheckConfig<T> = {
  dc: number
  criticalSuccess: T,
  success: T,
  failure: T,
  criticalFailure: T,
}

type ActivityEvent<T> = {
    settings: Settings
    outcome: AbilityCheckOutcome<T>
}


type Proficiency = 'trained' | 'expert' | 'master' | 'legendary'

type Result = 'Success' | 'Failure' | 'Critical Success' | 'Critical Failure'

type AbilityCheckOutcome<T> = {
  result: Result,
  value: T,
  d20Result: number,
  modifier: number,
  bonus: number,
  total: number
}

type TreatWoundsCheck = {
  healing: number,
  harm: number,
  net: number
}

type RollMapping = {
  treat: Result,
  as: Result,
  bonus: number
}
