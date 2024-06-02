export type DiceTypeInput = number | 'F'

export interface RollInstruction {
  id: number,
  modifier: number,
  numberOfDiceToRoll: number,
  diceType: DiceTypeInput,
  timesToReroll: number,
  numberOfHighestToKeep: number,
  numberOfLowestToKeep: number,
  rerollMinValue: number
}

const parseInput = (input: string): RollInstruction[] => {
  const instructions: RollInstruction[] = []
  input = input.replace(/\s/g, '')

  const steps = input.split(/(?=[+-])/g)

  steps.forEach((step, index) => {
    const stepMatch = /^((?<mod>[+-]){0,1}(?<input>.*)$)/.exec(step)

    const modifier = stepMatch?.groups?.mod === '-' ? -1 : 1

    const match = /^(?:(?<x>[\d]+x)){0,1}(?<n>\d+)(?:d(?<d>[\d%F]+)){0,1}(?:kh{0,1}(?<kh>\d+)){0,1}(?:kl(?<kl>\d+)){0,1}(?<reroll>!\d*){0,1}$/.exec(stepMatch?.groups?.input as string)

    if (!match) {
      throw new Error('invalid syntax')
    }

    const numberOfDiceToRoll = parseInt(match?.groups?.n as string) || 1
    const diceType = parseDiceType(match?.groups?.d as string)
    const timesToReroll = parseInt(match?.groups?.x as string) || 1
    const numberOfHighestToKeep = parseInt(match?.groups?.kh as string) || 0
    const numberOfLowestToKeep = parseInt(match?.groups?.kl as string) || 0
    const rerollMinValue = parseReroll(match?.groups?.reroll as string, diceType) || 0

    instructions.push({ id: index, numberOfDiceToRoll, diceType, modifier, timesToReroll, numberOfHighestToKeep, numberOfLowestToKeep, rerollMinValue })
  })

  return instructions
}

const parseDiceType = (d: string): DiceTypeInput => {
  if (d === '%') {
    return 100
  }

  if (d === 'F') {
    return d
  }

  return parseInt(d) || 1
}

const parseReroll = (rerollGroup: string, diceType: DiceTypeInput): number => {
  if (!rerollGroup) {
    return 0;
  }

  if (rerollGroup.length < 2) {
    return getMaxValue(diceType)
  }

  return parseInt(rerollGroup.substring(1))
}

const getMaxValue = (diceType: DiceTypeInput) => {
  if (diceType === 'F') return 1
  return diceType
}

export default parseInput
