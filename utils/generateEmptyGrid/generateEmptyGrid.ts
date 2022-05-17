export const generateEmptyGrid = (rows: number, cols: number) => {
  if (rows < 1 || cols < 1) {
    return []
  }
  const h = rows
  const w = cols
  const grid: number[][] = []
  for (let i = 0; i < h; i++) {
    const row = []
    for (let j = 0; j < w; j++) {
      row.push(0)
    }
    grid.push(row)
  }
  return grid
}
