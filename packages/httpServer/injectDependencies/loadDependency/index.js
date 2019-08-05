import {
	map,
	get,
	set,
	has,
	each,
	isFunction,
	isObject
} from 'lodash';
import extractDependencies from './extractDependencies';
import compose from '../compose';

const loadDependency = async (manifest, name, dependency, dependencies, depChain, path = []) => {
	const fullPath = path.length > 0 ? `${path.join('.')}.${name}` : name;
	const dependecyPath = `${DEPENDENCY_PROPERTY}.${fullPath}`;
	if (has(manifest, dependecyPath)) {
		return manifest;
	}
	if (isFunction(dependency)) {
		const deps = extractDependencies(dependency, DEPENDENCY_PROPERTY);
		await compose(deps.map((dep) => async (manifest) => {
			if (!manifest[DEPENDENCY_PROPERTY][dep] && dep !== name) {
				// if (depChain[dep]) {
				//  throw new Error(`circular dependency detected. ${dep} is already in ${name}'s dependency chain. ${JSON.stringify(depChain, 0, 2)}`);
				// }
				if (!dependencies[dep]) {
					throw new Error(`Unknown dependency ${dep} in module: ${fullPath.join('.')}${name}`);
				}
				depChain[dep] = true;
				// manifest[DEPENDENCY_PROPERTY][dep] = loadDependency(manifest, dep, dependencies[dep], dependencies, depChain);
				manifest = await loadDependency(manifest, dep, dependencies[dep], dependencies, depChain);
			}
			return manifest;
		}))(manifest);
		if (!has(manifest, dependecyPath)) {
			const value = await dependency(manifest);
			set(manifest, `${DEPENDENCY_PROPERTY}.${fullPath}`, value);
		}
	} else if (isObject(dependency)) {
		path.push(name);
		await compose(
			map(dependency, (dep, subName) => async (manifest) => await loadDependency(manifest, subName, dep, dependencies, depChain, path))
		)(manifest);
	} else if (isArray(dependency)) {
		path.push(name);
		await compose(
			map(dependency, (dep, index) => async (manifest) => await loadDependency(manifest, `[${index}]`, dep, dependencies, depChain, path))
		)(manifest);
	} else {
		throw new Error(`Dependency ${path.join('.')}.${name} must be either a function, object, or array. type ${typeof dependency} not injectable`);
	}
	return manifest;
};
