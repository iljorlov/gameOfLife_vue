/**
 * Counts neighbors of a cell in a grid seamlessly (w/o border).
 * @function
 */
export const countNeighborsSeamless = (
  grid: number[][],
  x: number,
  y: number
): number => {
  let count = 0
  const numCols = grid[0].length
  const numRows = grid.length
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = (x + i + numCols) % numCols
      const row = (y + j + numRows) % numRows

      count += grid[row][col]
    }
  }
  count -= grid[y][x]
  return count
}
