export function getRandomIntInclusive(min: number, max: number, amountOfNumbers: number): number[] {
  min = Math.ceil(min);
  max = Math.floor(max);

  const randomNumbers: number[] = [];
  while (randomNumbers.length < amountOfNumbers) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomNumbers.find((num: number) => num === randomNum) === undefined) {
      randomNumbers.push(randomNum);
    }
  }
  return randomNumbers;
}
