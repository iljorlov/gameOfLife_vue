export const mergeTwoGrids = (
  gridToInsert: number[][],
  recipientGridCols: number,
  recipientGridRows: number
): number[][] => {
  let providedGridCols = gridToInsert[0].length
  let providedGridRows = gridToInsert.length

  // case for when dimensions are the same
  if (
    providedGridCols === recipientGridCols &&
    providedGridRows === recipientGridRows
  ) {
    return gridToInsert
  }

  // const maxCols = Math.max(providedGridCols, recipientGridCols)
  // const maxRows = Math.max(providedGridRows, recipientGridRows)

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
  let colsToAdd = recipientGridCols - providedGridCols
  let colToAddBEFORE = Math.floor(colsToAdd / 2)
  let colToAddAfter = colsToAdd - colToAddBEFORE

  let rowsToAdd = recipientGridRows - providedGridRows
  let rowsToAddBEFORE = Math.floor(rowsToAdd / 2)
  let rowsToAddAfter = rowsToAdd - rowsToAddBEFORE

  let bufGrid: number[][] = []
  while (rowsToAddBEFORE) {
    let newRow = Array.from(Array(recipientGridCols)).map((i) => 0)
    bufGrid.push(newRow)
    rowsToAddBEFORE--
    continue
  }

  for (let curRow = 0; curRow < providedGridRows; curRow++) {
    let newRow: number[] = []
    let currentColsBefore = colToAddBEFORE
    let currentColsAfter = colToAddAfter
    while (currentColsBefore) {
      newRow.push(0)
      currentColsBefore--
    }
    newRow = [...newRow, ...gridToInsert[curRow]]

    while (currentColsAfter) {
      newRow.push(0)
      currentColsAfter--
    }
    bufGrid.push(newRow)
  }

  while (rowsToAddAfter) {
    let newRow = Array.from(Array(recipientGridCols)).map((i) => 0)
    bufGrid.push(newRow)
    rowsToAddAfter--
    continue
  }
  console.log('-=====================')
  console.log(bufGrid)
  console.log('-=====================')

  return bufGrid
}
