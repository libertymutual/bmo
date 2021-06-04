const base = ({ name, description }) => ({
  name: name,
  version: '1.0.0',
  description: description,
  main: 'index.js',
  scripts: {
    test: 'jest --passWithNoTests && echo \'\\033[0;31m ***Jest is passing with no tests. You should change that***\\033[0m\'',
    start: 'bmo run',
    dev: 'NODE_ENV=local bmo run -d',
    lint: 'eslint .',
    'lint:fix': 'eslint --fix .'
  },
  author: '',
  license: 'SEE LICENSE.md',
  devDependencies: {
    jest: '^24.8.0'
  },
  bmo: {
    extends: '@b-mo/http-server'
  },
  jest: {
    reporters: [
      'default'
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/*.js',
      '!**/node_modules/**'
    ],
    projects: [
      '<rootDir>'
    ]
  }
})
const scripts = {
  snyk: {
    'snyk:test': 'snyk test',
    'snyk:wizard': 'snyk wizard'
  },
  eslint: {
    lint: 'eslint .',
    'lint:fix': 'eslint --fix .'
  }
}
const dependencies = {
  snyk: {
    snyk: '^1.167.0'
  },
  eslint: {
    eslint: '^6.2.2'
  }
}

export default info => {
  const basePkg = base(info)
  if (info.snyk) {
    basePkg.scripts = {
      ...basePkg.scripts,
      ...scripts.snyk
    }

    basePkg.devDependencies = {
      ...basePkg.devDependencies,
      ...dependencies.snyk
    }
  }

  if (info.eslint) {
    basePkg.scripts = {
      ...basePkg.scripts,
      ...scripts.eslint
    }

    basePkg.devDependencies = {
      ...basePkg.devDependencies,
      ...dependencies.eslint
    }
  }

  return JSON.stringify(basePkg, 0, 2)
}
