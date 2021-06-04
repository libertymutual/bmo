export default (({
  config: {
    pkg: { version },
    printLogo = true
  },
  dependencies: { logo, commander: program }
}) => () => {
  if (printLogo) {
    console.log(logo())
  }

  console.log(`BMO CLI v ${version}`)
  if (program.parseAsync) {
    return program.parseAsync(process.argv)
  }

  return program.parse(process.argv)
})
