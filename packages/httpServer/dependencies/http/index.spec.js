
import http from '.'

describe('http', () => {
  it('Should match the snapshot', () => {
    expect(http({})).toMatchSnapshot()
  })
})
