import ui from '.'
const docs = '/api/docs'
describe('swagger.ui', () => {
  it('Should inject the doc url into the html', () => {
    const html = ui()({ docs })
    expect(new RegExp(`spec-url='${docs}'`).test(html)).toBeTruthy()
  })
})
