import mergeTwoGrids from '.'
describe('merges two grids', () => {
  it('merges two grid if recipient has less rows', () => {
    let grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    expect(mergeTwoGrids(grid, 16, 5)).toHaveLength(5)
    expect(mergeTwoGrids(grid, 16, 5)[0]).toHaveLength(16)
    // expect(mergeTwoGrids(grid, 16, 5)).toEqual([
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ])
  })
  it('merges two grids if recipient has more cols or rows than the provided grid', () => {
    let grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]

    let recipientCols = 5
    let recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ])

    // // next
    grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]

    recipientCols = 3
    recipientRows = 5

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])

    // next
    grid = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ]

    recipientCols = 5
    recipientRows = 5

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
    ])

    // next
    // grid = [
    //   [1, 0],
    //   [0, 1],
    // ]

    // recipientCols = 5
    // recipientRows = 5

    // expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
    //   [0, 0, 0, 0, 0],
    //   [0, 1, 0, 0, 0],
    //   [0, 0, 1, 0, 0],
    //   [0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0],
    // ])
  })
  it("merges two grids if recipients cols and rows are both fewer than the new one's", () => {
    let grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]

    let recipientCols = 3
    let recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])

    //  next
    grid = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    recipientCols = 3
    recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0],
      [1, 0, 0],
      [0, 0, 0],
    ])

    //  next
    grid = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    recipientCols = 3
    recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])

    //  next
    grid = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
    recipientCols = 2
    recipientRows = 2

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [1, 1],
      [1, 1],
    ])
  })
  it('merges two grids of same dimensions correctly', () => {
    let grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]
    let recipientCols = 3
    let recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ])

    //  next
    grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
      [2, 2, 2],
    ]
    recipientCols = 3
    recipientRows = 4

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
      [2, 2, 2],
    ])

    //  next
    grid = [
      [0, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 0, 1],
    ]
    recipientCols = 4
    recipientRows = 3

    expect(mergeTwoGrids(grid, recipientCols, recipientRows)).toEqual([
      [0, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 0, 1],
    ])
  })
})
