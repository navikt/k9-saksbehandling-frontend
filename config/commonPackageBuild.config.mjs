import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    input: 'index.ts',
    output: [
        {
            sourcemap: true,
            format: 'cjs',
            file: './build/index.cjs.js',
        },
        { sourcemap: true, file: './build/index.js' },
    ],
    plugins: [
        peerDepsExternal(),
        typescript({
            tsconfig: './tsconfig.json',
        }),
    ],
};
