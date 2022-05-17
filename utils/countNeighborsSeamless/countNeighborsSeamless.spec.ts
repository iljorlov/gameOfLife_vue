import { countNeighborsSeamless } from './countNeighborsSeamless'

describe('count neighbors in a grid', () => {
  test('counts neighbors in a grid correctly', () => {
    let grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsSeamless(grid, 0, 0)).toBe(3)
    grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsSeamless(grid, 0, 0)).toBe(2)
    grid = [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsSeamless(grid, 1, 2)).toBe(2)
    const twoTriangles = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    expect(countNeighborsSeamless(twoTriangles, 0, 0)).toEqual(0) // top left
    expect(countNeighborsSeamless(twoTriangles, 10, 3)).toEqual(1) // bottom right
    expect(countNeighborsSeamless(twoTriangles, 1, 2)).toEqual(2) //
  })
})
