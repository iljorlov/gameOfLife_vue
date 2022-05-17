export const countNeighborsSeamless = (g: number[][], x: number, y: number) => {
  let count = 0
  const numCols = g[0].length
  const numRows = g.length
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = (x + i + numCols) % numCols
      const row = (y + j + numRows) % numRows

      count += g[row][col]
    }
  }
  count -= g[y][x]
  return count
}
