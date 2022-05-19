import { countNeighborsBorder } from './countNeighborsBorder'

describe('count neighbors in a grid', () => {
  test('counts neighbors in a grid correctly', () => {
    let grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsBorder(grid, 0, 0)).toBe(3)
    grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsBorder(grid, 0, 0)).toBe(2)
    grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
      [1, 0, 0],
    ]
    expect(countNeighborsBorder(grid, 0, 0)).toBe(2)
    grid = [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]
    expect(countNeighborsBorder(grid, 1, 2)).toBe(2)
    const twoTriangles = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    expect(countNeighborsBorder(twoTriangles, 0, 0)).toEqual(0) // top left
    expect(countNeighborsBorder(twoTriangles, 10, 3)).toEqual(1) // bottom right
    expect(countNeighborsBorder(twoTriangles, 1, 2)).toEqual(2) //
  })
})
