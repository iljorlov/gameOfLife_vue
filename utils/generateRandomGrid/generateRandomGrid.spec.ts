import generageRandomGrid from '.'

describe('generates random grid', () => {
  test('generates a new grid with correct dimensions', () => {
    expect(generageRandomGrid(2, 6)).toHaveLength(6)
    expect(generageRandomGrid(2, 6)[0]).toHaveLength(2)

    expect(generageRandomGrid(20, 10)).toHaveLength(10)
    expect(generageRandomGrid(20, 10)[0]).toHaveLength(20)

    expect(generageRandomGrid(1, 1)).toHaveLength(1)
    expect(generageRandomGrid(1, 1)[0]).toHaveLength(1)
  })
})
