import roll from "."

export type AbilityCheckConfig = {
  dc: number
  criticalSuccess: () => number,
  success: () => number,
  failure: () =>number,
  criticalFailure: () => number,
}

export type Result = 'Success' | 'Failure' | 'Critical Success' | 'Critical Failure'

export type AbilityCheckOutcome = {
  result: Result,
  value: number,
  d20Result: number,
  modifier: number,
  bonus: number,
  total: number
}

export type Proficiency = 'trained' | 'expert' | 'master' | 'legendary'

export const treatWoundsConfig: Record<Proficiency, AbilityCheckConfig> = {
  "trained": {
    dc: 15,
    criticalSuccess: () => roll('4d8').total,
    success:  () => roll('2d8').total,
    failure: () => 0,
    criticalFailure: () => roll('-1d8').total
  },
  "expert": {
    dc: 20,
    criticalSuccess: () => roll('4d8+10').total,
    success:  () => roll('2d8+10').total,
    failure: () => 0,
    criticalFailure: () => roll('-1d8').total
  },
  "master": {
    dc: 30,
    criticalSuccess: () => roll('4d8+30').total,
    success:  () => roll('2d8+30').total,
    failure: () => 0,
    criticalFailure: () => roll('-1d8').total
  },
  "legendary": {
    dc: 40,
    criticalSuccess: () => roll('4d8+50').total,
    success:  () => roll('2d8+50').total,
    failure: () => 0,
    criticalFailure: () => roll('-1d8').total
  }
}

export const aidConfig: Record<Proficiency, AbilityCheckConfig>  = {
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

const withOperator = (value: number) => {
  if (value === 0){
    return ''
  } else if (value > 0){
    return `+${value}`
  }
  return `${value}`
}

const clamp = (value: number, min: number, max: number) =>  Math.min(Math.max(value, min), max)

const createOutcomes = (config: AbilityCheckConfig): {result: Result, value: number }[] => [
  {
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
  }
]

export const abilityCheck = (modifier: number, bonus: number, failureAsSuccess: boolean, config: AbilityCheckConfig): AbilityCheckOutcome => {
  console.log(`1d20${withOperator(modifier)}${withOperator(bonus)}`)
  const check = roll(`1d20${withOperator(modifier)}${withOperator(bonus)}`)
  const d20Result = check.details[0].value
  const outcomes = createOutcomes(config)

  // 1. did we exceed the dc?
  let score = check.total > config.dc ? 2 : 1

  // 2. how far away are we from the dc?
  if (check.total > config.dc + 10) {
    score = score + 1
  } else if (check.total < config.dc - 10) {
    score = score - 1
  }

  // 3. what number did the dice produce?
  if (d20Result === 1) {
    score = score - 1
  } else if (d20Result === 20) {
    score = score + 1
  }

  if (failureAsSuccess && score === 1) {
    score = 2
  }

  score = clamp(score, 0, 3)

  return {
    d20Result,
    modifier,
    bonus,
    total: check.total,
    ...outcomes[score],
  }
}
