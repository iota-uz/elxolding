import plugin from 'tailwindcss/plugin';

import { type BreadcrumbConfig, defaultConfig, key } from './breadcrumb.config';

const config = {
    theme: {
        nui: {
            [key]: defaultConfig,
        },
    },
};

export default plugin(({ addComponents, theme }) => {
    const config = theme(`nui.${key}`) satisfies BreadcrumbConfig;

    addComponents({
        '.nui-breadcrumb': {
            '.nui-breadcrumb-list': {
                [`@apply mb-6 flex items-center font-${config.item.text.font.family} text-${config.item.text.font.size}`]:
          {},
                '.nui-breadcrumb-item-mobile': {
                    '@apply me-3 sm:hidden': {},
                },
                '.nui-breadcrumb-item:not(:last-child)': {
                    '@apply hidden sm:flex': {},
                },
                '.nui-breadcrumb-item:last-child': {
                    [`@apply flex text-${config.item.text.font.color.light} dark:text-${config.item.text.font.color.dark}`]:
            {},
                },
                '.nui-item-inner': {
                    //Base
                    [`@apply text-${config.item.text.font.size} flex items-center gap-x-1`]:
            {},
                    //Color
                    [`@apply text-${config.item.text.font.color.light} dark:text-${config.item.text.font.color.dark}`]:
            {},
                    //Transition
                    [`@apply transition-${config.item.transition.property} duration-${config.item.transition.duration}`]:
            {},
                    //Item:icon
                    '.nui-item-icon': {
                        //icon
                        [`@apply flex items-center justify-center h-${config.item.icon.size} w-${config.item.icon.size} shrink-0`]:
              {},
                        //dot
                        '&.nui-has-dot': {
                            [`@apply text-${config.item.dot.font.size}`]: {},
                        },
                    },
                    //Item:link
                    '&.nui-has-link': {
                        [`@apply hover:text-${config.item.link.font.color.hover} focus:text-${config.item.link.font.color.focus}`]:
              {},
                    },
                    //Item:text
                    '.nui-item-text': {
                        [`@apply text-${config.item.text.font.color.light} dark:text-${config.item.text.font.color.dark} px-${config.item.text.padding.x}`]:
              {},
                    },
                },
            },
        },
    });
}, config);
