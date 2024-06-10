import { results } from "../checks"

export const aidConfig: Record<Proficiency, AbilityCheckConfig<number>> = {
  "trained": {
    dc: 15,
    criticalSuccess: 2,
    success: 1,
    failure: 0,
    criticalFailure: -1
  },
  "expert": {
    dc: 15,
    criticalSuccess: 2,
    success: 1,
    failure: 0,
    criticalFailure: -1
  },
  "master": {
    dc: 15,
    criticalSuccess: 3,
    success: 1,
    failure: 0,
    criticalFailure: -1
  },
  "legendary": {
    dc: 15,
    criticalSuccess:  4,
    success: 1,
    failure: 0,
    criticalFailure: -1
  }
}

export const createAidRollMapping = (settings: Settings): RollMapping => {
  return {
    bonus: 0,
    treat: results.SUCCESS,
    as: settings.aidFailureAsSuccess ? results.CRITICAL_SUCCESS : results.SUCCESS
  }
}
