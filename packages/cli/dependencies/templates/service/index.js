import fs from 'fs-extra'
import templates from './templates'
export default ({ dependencies: { packageman, logger }}) => async ({ name }) => {
  const baseDir = process.cwd()
  const questions = [{
    name: 'continue',
    when: () => !fs.emptyDirSync(baseDir),
    type: 'confirm',
    message: 'The current directory is not empty. Do you want to continue?'
  },
  {
    name: 'name',
    default: name,
    message: 'project name',
    when: answers => {
      if (!answers.continue) {
        logger.info('Aborting project creation')
        process.exit(0)
      }

      return true
    }
  },
  {
    name: 'description',
    message: 'Project description'
  },
  {
    type: 'list',
    choices: packageman.packageManagers,
    name: 'packageManager',
    message: 'Which package manager do you want to use'
  },
  {
    type: 'confirm',
    default: 'yes',
    name: 'eslint',
    message: 'Would you like to run eslint on the project?'
  }]
  const packages = [ '@b-mo/cli', '@b-mo/http-server', '@b-mo/extension-run' ]
  return {
    questions,
    preProcess: async ({ files, answers }) => {
      if (answers.eslint) {
        files[`${baseDir}/.eslintrc.js`] = templates.eslint
      }

      return { files, answers }
    },
    files: {
      [`${baseDir}/config/index.js`]: templates.config.index,
      [`${baseDir}/config/routes.js`]: () => templates.config.routes({}),
      [`${baseDir}/package.json`]: templates.pkg,
      [`${baseDir}/dependencies/index.js`]: templates.dependencies.index,
      [`${baseDir}/dependencies/routes/index.js`]: templates.routes.index,
      [`${baseDir}/.gitignore`]: templates.gitIgnore
    },
    postProcess: async ({ answers: { packageManager, eslint }}) => {
      logger.info('Installing dependencies...')
      packageman.use(packageManager)
      await Promise.all(packages.map(async pkg => packageman.add(pkg)))

      await packageman.install()
      if (eslint) {
        logger.info('Running eslint...')
        await packageman.run('lint:fix')
      }

      logger.info('Project creation successful!')
    }
  }
}
