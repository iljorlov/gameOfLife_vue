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
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = x + i
      const row = y + j
      if (grid[row] !== undefined && grid[row][col] !== undefined) {
        count += grid[row][col]
      }
    }
  }
  count -= grid[y][x]
  return count
}
