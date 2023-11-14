// eslint-disable-next-line import/no-extraneous-dependencies
import { mergeConfig } from 'vite';
import commonConfig from '../../../vite.config';


const config = ({
    build: {
        lib: {
            name: '@navikt/k9-fe-form-utils',
        },

    },
});

export default mergeConfig(commonConfig, config);
