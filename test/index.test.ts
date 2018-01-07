import { adder, sub } from '../src/index'

describe('Simple test', () => {
  it('adder', () => {
    expect(adder(2, 3)).toEqual(5)
  })

  it('async', async () => {
    const ret = await sub(5, 3)
    expect(ret).toEqual(2)
  })
})
