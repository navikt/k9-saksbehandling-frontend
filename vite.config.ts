/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            copyDtsFiles: true,
        }),
    ],
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },
    build: {
        lib: {
            entry: 'index.ts',
            formats: ['es', 'umd'],
            fileName: (format) => `index.${format}.js`,
        },
        sourcemap: true,
        rollupOptions: {
            plugins: [peerDepsExternal()],
        },
        outDir: 'build',
    },
};
