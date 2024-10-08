import babel from '@rollup/plugin-babel';
import sass from 'rollup-plugin-sass';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

export default {
    input: pkg.source,
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' },
    ],
    plugins: [
        sass({ output: 'dist/styles.css' }),
        external(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        del({ targets: ['dist/*'] }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
};
