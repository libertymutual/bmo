# Contributing
We are always accepting PRs, feature requests, and bug reports.
If you want to contribute open an issue on our [github](https://github.com/libertymutual/bmo)
explaining the feature or bug and we can start the conversation on how best to address it.

Any code contributions should have accompanying tests and follow the core principles of extendability, modularity, and developer empowerment.

Once you have opened an issue and discussed the feature with the team and we have decided that the feature cannot be implemented
through an extension or the feature belongs in the core framework create a fork of our repository.

From there create a branch in your repository and complete the feature.

Features should be well tested and documented. Once you have completed the code for the feature open
a PR to our master branch. From there we will conduct a code review and once approved by the team we
will merge and publish your feature to the package(s).

All contributions should follow the existing style of the package and pass our eslint and testing process.

No pull requests will be approved unless all tests and linting are passing.

All contributions must follow (semantic versioning)[https://semver.org/] and appropriate version bumps must be included in your PR



## Other ways to get involved

There are more ways to contribute to BMO than just new features. Bug fixes, additions to the documentation,
new modules and extensions are just some of the other ways you can contribute. If you have an awesome extension
or have written a new module we want to know!

If you think updates to the docs are in order, feel free to follow the contributions guidelines above for documentation updates.
The package docs are generated from the readmes in the root of each package. Just run `npm run copy:docs` to update the package docs.
You can run the docs locally to make sure things look all right by running `npm run docs`.
