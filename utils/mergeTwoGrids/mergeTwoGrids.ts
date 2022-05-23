import generateEmptyGrid from '../generateEmptyGrid'

export const mergeTwoGrids = (
  gridToInsert: number[][],
  recipientGridCols: number,
  recipientGridRows: number
): number[][] => {
  if (recipientGridCols <= 0 || recipientGridRows <= 0) {
    return gridToInsert
  }
  const providedGridCols = gridToInsert[0].length
  const providedGridRows = gridToInsert.length

  // case for when dimensions are the same
  if (
    providedGridCols === recipientGridCols &&
    providedGridRows === recipientGridRows
  ) {
    return gridToInsert
  }

  const sliceStartX = Math.floor((providedGridCols - recipientGridCols) / 2)
  const sliceStartY = Math.floor((providedGridRows - recipientGridRows) / 2)
  const sliceEndX = sliceStartX + recipientGridCols
  const sliceEndY = sliceStartY + recipientGridRows

  if (
    providedGridCols >= recipientGridCols &&
    providedGridRows >= recipientGridRows
  ) {
    return gridToInsert
      .slice(sliceStartY, sliceEndY)
      .map((i) => i.slice(sliceStartX, sliceEndX))
  }

  const grid: number[][] = generateEmptyGrid(
    recipientGridRows,
    recipientGridCols
  )

  const offsetX = Math.floor((grid[0].length - gridToInsert[0].length) / 2)

  const offsetY = Math.floor((grid.length - gridToInsert.length) / 2)

  for (let i = 0; i < gridToInsert.length; i++) {
    for (let j = 0; j < gridToInsert[0].length; j++) {
      const yPos = Math.max((i + offsetY) % grid.length, 0)
      const xPos = Math.max((j + offsetX) % grid[0].length, 0)
      const valToInsert = gridToInsert[i][j]

      grid[yPos][xPos] = valToInsert
    }
  }

  return grid
}
