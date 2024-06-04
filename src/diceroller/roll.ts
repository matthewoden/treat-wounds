import getRand from './rand'
import parseInput, { DiceTypeInput, RollInstruction } from './parseInput'

export interface RollResultDetail {
  total: number,
  instructions: RollInstruction[],
  details: RollDetail[]
}

export interface RollDetail {
  id: number,
  instructionId: number,
  modifier: number,
  diceType: DiceTypeInput,
  value: number,
  discard: boolean
}

const roll = (input: string | number): RollResultDetail => {
  const instructions = parseInput('' + input)

  let id = 0
  const details = instructions.reduce((final, { id: instructionId, diceType, numberOfDiceToRoll, modifier, timesToReroll, numberOfHighestToKeep, numberOfLowestToKeep }) => {

    for (let i = 0; i < timesToReroll; i++) {
      let groupResults = []
      for (let k = 0; k < (diceType === 1 ? 1 : numberOfDiceToRoll); k++) {
        const r: RollDetail = { id: id++, instructionId, diceType, modifier, value: 0, discard: false }
        r.value = (diceType === 1) ? numberOfDiceToRoll : rollADie(diceType)
        r.value = r.value * modifier
        groupResults.push(r)
      }

      groupResults = handleDiscards(groupResults, numberOfHighestToKeep, numberOfLowestToKeep)

      final = final.concat(groupResults)
    }

    return final
  }, [] as RollDetail[])


  const total = details.reduce((total, r) => r.discard ? total : (total + r.value), 0)

  return { total, instructions, details }
}

const handleDiscards = (results: RollDetail[], kh: number, kl: number): RollDetail[] => {
  if (!kh && !kl) return results

  results = results.sort((a, b) => a.value < b.value ? -1 : 1).map(r => ({ ...r, discard: true }))

  if (kl) {
    results = results.map((r, index) => ({ ...r, discard: index < kl ? false : r.discard }))
  }

  if (kh) {
    results = results.map((r, index) => ({ ...r, discard: index >= results.length - kh ? false : r.discard }))
  }

  return results.sort((a, b) => a.id > b.id ? 1 : -1)
}

const rollADie = (sides: DiceTypeInput): number => {
  if (sides === 'F') {
    return Math.floor(getRand()() * 3) - 1
  }
  if (typeof sides === 'number') {
    return Math.floor(getRand()() * sides) + 1
  }
  return 0
}

export default roll
