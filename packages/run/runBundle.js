#!/usr/bin/env node
import commander from 'commander'
import runDevApp from './runDevApp'
import { fork } from 'child_process'
const esm = require.resolve('esm')

commander
  .storeOptionsAsProperties()
  .option('-d, --dev', 'Starts a watch on the base directory to look for changes')
  .allowUnknownOption()

const cwd = process.cwd()
commander.parse(process.argv)
const args = commander.rawArgs.slice(2)
if (commander.dev) {
  console.log('starting dev...')
  runDevApp({ args, cwd })
} else {
  fork(`${__dirname}/runApp.js`, args, { cwd, execArgv: [ '-r', esm ]})
}
