import { results } from "../checks"
import roll from "../roll"

const treatWoundsConstants = [
  { key: 'trained', dc: 15, bonus: 0, medic: 0 },
  { key: 'expert', dc: 20, bonus: 10, medic: 5, },
  { key: 'master', dc: 30, bonus: 30, medic: 10, },
  { key:'legendary', dc: 40, bonus: 50, medic: 15, }
]

type TreatWoundsConfig = Record<Proficiency, AbilityCheckConfig<TreatWoundsCheck>>

export const createTreateWoundsConfig = (settings: Settings): TreatWoundsConfig => {
  // TODO: replace with settings.

  const diceType = settings.magicHands ? 10 : 8
  const success = roll(`2d${diceType}`).total
  const criticalSuccess = roll(`4d${diceType}`).total
  const criticalFailure = roll(`1d8`).total
  const harm = settings.riskySurgery ? roll(`1d8`).total : 0

  return treatWoundsConstants.reduce((acc, {key, dc, bonus, medic}) => {
    const medicBonus = settings.medicArchetype ? medic : 0
    const successTotal = success + bonus + medicBonus
    const criticalSuccessTotal = criticalSuccess + bonus + medicBonus

    acc[key as Proficiency] = {
      dc,
      success: {
        healing: successTotal,
        harm,
        net: successTotal - harm
      },
      criticalSuccess: {
        healing: criticalSuccessTotal,
        harm: -harm,
        net: criticalSuccessTotal - harm
      },
      failure: {
        healing: 0,
        harm,
        net: -harm
      },
      criticalFailure: {
        healing: 0,
        harm: -(criticalFailure + harm),
        net: -(criticalFailure + harm)
      },
    }
    return acc
  }, {} as Record<Proficiency, AbilityCheckConfig<TreatWoundsCheck>>)
}

export const createTreatWoundsRollMapping = (settings: Settings): RollMapping => {
  const riskySurgeryBonus = settings.riskySurgery ? 2 : 0
  const bonus = riskySurgeryBonus

  return {
    bonus,
    treat: results.SUCCESS,
    as: (settings.riskySurgery || settings.mortalHealing) ? results.CRITICAL_SUCCESS : results.SUCCESS
  }
}
