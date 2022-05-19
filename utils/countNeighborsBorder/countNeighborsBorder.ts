/**
 * Counts neighbors of a cell in a grid with border.
 * @function
 */
export const countNeighborsBorder = (
  grid: number[][],
  x: number,
  y: number
): number => {
  let count = 0
  const gridRows = grid.length - 1
  const gridCols = grid[0].length - 1
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = x + i
      const row = y + j
      if (row < 0 || col < 0 || row > gridRows || col > gridCols) {
        continue
      }
      count += grid[row][col]
    }
  }
  count -= grid[y][x]
  return count
}
