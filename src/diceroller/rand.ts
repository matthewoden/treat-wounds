type Randomizer = () => number

export const DEFAULT_RANDOMIZER = Math.random

let rand: Randomizer = DEFAULT_RANDOMIZER

export const overrideRandomizer = (newRandom: Randomizer): void => {
  rand = newRandom
}

export const resetRandomizer = (): void => {
  rand = DEFAULT_RANDOMIZER
}

export const getRand = (): Randomizer => rand

export default getRand
