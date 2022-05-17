import generateEmptyGrid from '.'

describe('generate Empty Grid', () => {
  test('generates grids correctly', () => {
    let grid = generateEmptyGrid(3, 3)
    expect(grid).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ])
    expect(grid).not.toEqual([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ])

    grid = generateEmptyGrid(0, 0)
    expect(grid).toEqual([])

    grid = generateEmptyGrid(0, 1)
    expect(grid).toEqual([])
    grid = generateEmptyGrid(1, 0)
    expect(grid).toEqual([])

    grid = generateEmptyGrid(1, 1)
    expect(grid).toEqual([[0]])
  })
})
