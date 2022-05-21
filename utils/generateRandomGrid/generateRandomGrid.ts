export const generateRandomGrid = (
  numCols: number,
  numRows: number,
  weight = 0.7
) => {
  return Array.from(Array(numRows)).map((row) =>
    Array.from(Array(numCols)).map((val) => (Math.random() > weight ? 1 : 0))
  )
}
