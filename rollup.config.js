import "es-expand"
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';


 /**
  * 获取 package.json 中配置的 description、optionalDependencies、peerDependencies 中的所有依赖的名字列表
  * Get an array of dependent names in the configuration of description, optional Dependencies, peer Dependencies configured in package.json
  * @param {*} packageConf  package.json 中的配置对象； Configuration objects in package.json
  * @returns Array<string>  返回包含 description、optionalDependencies、peerDependencies 中所有依赖名字的数组； Returns an array of all name-dependent names in the description, option, peer Dependencies
  */
function getDependencieNames(packageConf){
	return Object.keys(Object.assign({},packageConf.dependencies,packageConf.optionalDependencies,packageConf.peerDependencies))
}
  
  

export default [
	// browser-friendly UMD build
	{
		input: 'src/index',
		output: {
			name: pkg.name.toHumpFormat(),  //驼峰格式的 pkg.name
			file: pkg.browser || `dist/${pkg.name}.umd.js`,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			babel({
				exclude: ['node_modules/**']
			})
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/index',
		external: getDependencieNames(pkg),  //移除 package.json 中所有的依赖包
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**']
			})
		]
	}
];
