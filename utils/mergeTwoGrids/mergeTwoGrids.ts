import generateEmptyGrid from '../generateEmptyGrid'

export const mergeTwoGrids = (
  gridToInsert: number[][],
  recipientGridCols: number,
  recipientGridRows: number
): number[][] => {
  if (recipientGridCols <= 0 || recipientGridRows <= 0) {
    return gridToInsert
  }
  let providedGridCols = gridToInsert[0].length
  let providedGridRows = gridToInsert.length

  // case for when dimensions are the same
  if (
    providedGridCols === recipientGridCols &&
    providedGridRows === recipientGridRows
  ) {
    return gridToInsert
  }

  let sliceStartX = Math.floor((providedGridCols - recipientGridCols) / 2)
  let sliceStartY = Math.floor((providedGridRows - recipientGridRows) / 2)
  let sliceEndX = sliceStartX + recipientGridCols
  let sliceEndY = sliceStartY + recipientGridRows

  if (
    providedGridCols >= recipientGridCols &&
    providedGridRows >= recipientGridRows
  ) {
    return gridToInsert
      .slice(sliceStartY, sliceEndY)
      .map((i) => i.slice(sliceStartX, sliceEndX))
  }

  let grid: number[][] = generateEmptyGrid(recipientGridRows, recipientGridCols)

  const offsetX = Math.floor((grid[0].length - gridToInsert[0].length) / 2)
  const offsetY = Math.floor((grid.length - gridToInsert.length) / 2)

  for (let i = 0; i < gridToInsert.length; i++) {
    for (let j = 0; j < gridToInsert[0].length; j++) {
      grid[i + offsetY][j + offsetX] = gridToInsert[i][j]
    }
  }

  return grid
}
