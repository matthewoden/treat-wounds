import roll from "."

const withOperator = (value: number) => {
  if (value === 0){
    return ''
  } else if (value > 0){
    return `+${value}`
  }
  return `${value}`
}

const clamp = (value: number, min: number, max: number) =>  Math.min(Math.max(value, min), max)

export const results: Record<string, Result> = {
  CRITICAL_FAILURE: 'Critical Failure',
  FAILURE: 'Failure',
  SUCCESS: 'Success',
  CRITICAL_SUCCESS: 'Critical Success'
}

const createOutcomes = <T>(config: AbilityCheckConfig<T>): {result: Result, value: T }[] => [
  {
    result: results.CRITICAL_FAILURE,
    value: config.criticalFailure
  },
  {
    result: results.FAILURE,
    value: config.failure
  },
  {
    result: results.SUCCESS,
    value: config.success
  },
  {
    result: results.CRITICAL_SUCCESS,
    value: config.criticalSuccess
  }
]

const outcomeIndex: Record<Result, number> = {
  'Critical Failure': 0,
  'Failure': 1,
  'Success': 2,
  'Critical Success': 3
}

export const failureAsSuccess = { treat: results.FAILURE, as: results.SUCCESS }
export const successAsCriticalSuccess = {treat: results.SUCCESS, as: results.CRITICAL_SUCCESS }

export const abilityCheck = <T>(
    checkModifier: number,
    staticBonus: number,
    outcomeConfig: AbilityCheckConfig<T>,
    rollMapping?: RollMapping
  ): AbilityCheckOutcome<T> => {

  const allModifiers = checkModifier + staticBonus + (rollMapping?.bonus ?? 0)
  const check = roll(`1d20${withOperator(allModifiers)}`)
  const d20Result = check.details[0].value
  const outcomes = createOutcomes(outcomeConfig)

  // 1. did we exceed the dc?
  let score = check.total > outcomeConfig.dc ? 2 : 1

  // 2. how far away are we from the dc?
  if (check.total > outcomeConfig.dc + 10) {
    score = score + 1
  } else if (check.total < outcomeConfig.dc - 10) {
    score = score - 1
  }

  // 3. what number did the dice produce?
  if (d20Result === 1) {
    score = score - 1
  } else if (d20Result === 20) {
    score = score + 1
  }

  // do we treat one result as another?
  if (rollMapping) {
    if (score === outcomeIndex[rollMapping.treat]) {
      score = outcomeIndex[rollMapping.as]
    }
  }

  score = clamp(score, 0, 3)

  return {
    d20Result,
    modifier: checkModifier,
    bonus: staticBonus,
    total: check.total,
    ...outcomes[score],
  }
}
