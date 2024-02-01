import plugin from 'tailwindcss/plugin';

import { defaultConfig, key,type MarkConfig } from './mark.config';

const config = {
    theme: {
        nui: {
            [key]: defaultConfig,
        },
    },
};

export default plugin(({ addComponents, theme }) => {
    const config = theme(`nui.${key}`) satisfies MarkConfig;

    addComponents({
        '.nui-mark': {
            [`@apply bg-${config.background.light} dark:bg-${config.background.dark}`]:
        {},
            [`@apply text-${config.color.light} dark:text-${config.color.dark}`]: {},
        },
    });
}, config);
