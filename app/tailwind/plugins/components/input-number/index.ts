import plugin from 'tailwindcss/plugin';

import {
    defaultConfig,
    type InputNumberConfig,
    key,
} from './input-number.config';

const config = {
    theme: {
        nui: {
            [key]: defaultConfig,
        },
    },
};

export default plugin(({ addComponents, theme }) => {
    const config = theme(`nui.${key}`) satisfies InputNumberConfig;

    addComponents({
    //Wrapper
        '.nui-input-number-wrapper': {
            '@apply relative': {},
            //Input:label
            '.nui-input-number-label, .nui-label-float': {
                '@apply nui-label': {},
            },
            //Label:float
            '.nui-label-float': {
                [`@apply h-${config.label.float.height} absolute inline-flex items-center select-none pointer-events-none`]:
          {},
                //Font
                [`@apply font-${config.label.float.font.family} text-${config.label.float.font.color} leading-${config.label.float.font.lead}`]:
          {},
                //Transition
                [`@apply transition-${config.label.float.transition.property} duration-${config.label.float.transition.duration}`]:
          {},
            },
            //Input:outer
            '.nui-input-number-outer': {
                '@apply nui-focus relative': {},
            },
            //Input:icon
            '.nui-input-number-icon': {
                '@apply absolute start-0 top-0 z-10 flex items-center justify-center':
          {},
                //Color
                [`@apply text-${config.input.icon.color.base.light} dark:text-${config.input.icon.color.base.dark}`]:
          {},
                //Transition
                [`@apply transition-${config.input.icon.transition.property} duration-${config.input.icon.transition.duration}`]:
          {},
            },
            //Input:buttons
            '.nui-input-number-buttons': {
                '@apply absolute top-1 end-1 flex': {},
            },
            //Buttons:button
            '.nui-input-number-buttons > button': {
                '@apply outline-none flex items-center justify-center': {},
                '@apply last:border-s-0': {},
                '@apply text-muted-400 enabled:hover:text-muted-600 dark:enabled:hover:text-muted-100':
          {},
                '@apply enabled:focus:text-muted-600 dark:enabled:focus:text-muted-100':
          {},
                '@apply transition-colors duration-300': {},
                '@apply disabled:cursor-not-allowed': {},
            },
            //Button:icon
            '.nui-input-number-buttons svg': {
                '@apply h-4 w-4': {},
            },
            //Error:text
            '.nui-input-number-error-text': {
                //Base
                '@apply mt-1 block': {},
                //Font
                [`@apply font-${config.error.font.family} text-${config.error.font.size} font-${config.error.font.weight} leading-none`]:
          {},
                //Font color
                [`@apply text-${config.error.font.color.light} dark:text-${config.error.font.color.dark}`]:
          {},
            },
            //Input
            '.nui-input-number': {
                //Base
                [`@apply nui-focus w-${config.input.width} font-${config.input.font.family} disabled:cursor-not-allowed disabled:opacity-75`]:
          {},
                //Transition
                [`@apply transition-${config.input.transition.property} duration-${config.input.transition.duration}`]:
          {},
                //Focus:label:float
                '&:focus-visible ~ .nui-label-float': {
                    [`@apply !text-${config.input.focus.label.float.font.color.light} dark:!text-${config.input.focus.label.float.font.color.dark}`]:
            {},
                },
                //Focus:icon
                '&:focus-visible ~ .nui-input-number-icon': {
                    [`@apply !text-${config.input.icon.color.focus.light} dark:!text-${config.input.icon.color.focus.dark}`]:
            {},
                },
                //Disabled:icon
                '&:disabled ~ .nui-input-number-icon': {
                    '@apply cursor-not-allowed opacity-75': {},
                },
            },
            //Input:placeload
            '.nui-input-number-placeload': {
                '@apply absolute start-0 top-0 flex w-full items-center px-4': {},
                //Placeload:inner
                '.nui-placeload': {
                    '@apply h-3 w-full max-w-[50%] rounded': {},
                },
            },
            //Input:action
            '.nui-input-number-action': {
                //Base
                '@apply absolute end-0 top-0 flex items-center justify-center': {},
                //Color
                [`@apply text-${config.input.action.color.light} dark:text-${config.input.action.color.dark}`]:
          {},
                //Transition
                [`@apply transition-${config.input.action.transition.property} duration-${config.input.action.transition.duration}`]:
          {},
            },
            //Focus:color
            '&.nui-input-number-focus': {
                '.nui-input': {
                    [`@apply focus:border-${config.input.focus.border.color.light} dark:focus:border-${config.input.focus.border.color.dark}`]:
            {},
                },
            },
            //Rounded:sm
            '&.nui-input-number-rounded': {
                '.nui-input-number, .nui-input-number-outer': {
                    [`@apply ${config.rounded.sm}`]: {},
                },
                '.nui-input-number-buttons button': {
                    [`@apply first:rounded-s-${config.buttons.rounded.sm}`]: {},
                    [`@apply last:rounded-e-${config.buttons.rounded.sm}`]: {},
                },
            },
            //Rounded:md
            '&.nui-input-number-smooth': {
                '.nui-input-number, .nui-input-number-outer': {
                    [`@apply ${config.rounded.md}`]: {},
                },
                '.nui-input-number-buttons button': {
                    [`@apply first:rounded-s-${config.buttons.rounded.md}`]: {},
                    [`@apply last:rounded-e-${config.buttons.rounded.md}`]: {},
                },
            },
            //Rounded:lg
            '&.nui-input-number-curved': {
                '.nui-input-number, .nui-input-number-outer': {
                    [`@apply ${config.rounded.lg}`]: {},
                },
                '.nui-input-number-buttons button': {
                    [`@apply first:rounded-s-${config.buttons.rounded.lg}`]: {},
                    [`@apply last:rounded-e-${config.buttons.rounded.lg}`]: {},
                },
            },
            //Rounded:full
            '&.nui-input-number-full': {
                '.nui-input-number, .nui-input-number-outer': {
                    [`@apply ${config.rounded.full}`]: {},
                },
                '.nui-input-number-buttons button': {
                    [`@apply first:rounded-s-${config.buttons.rounded.full}`]: {},
                    [`@apply last:rounded-e-${config.buttons.rounded.full}`]: {},
                },
            },
            //Size:sm
            '&.nui-input-number-sm': {
                //Input:label
                '.nui-input-number-label': {
                    [`@apply pb-1 text-${config.size.sm.label.font.size}`]: {},
                },
                //Label:float
                '.nui-label-float': {
                    '@apply top-1.5': {},
                },
                //Input:icon && Input:action
                '.nui-input-number-icon, .nui-input-number-action': {
                    [`@apply h-${config.size.sm.icon.outer.size} w-${config.size.sm.icon.outer.size}`]:
            {},

                    '.nui-input-number-icon-inner, .nui-input-number-action-inner': {
                        [`@apply h-${config.size.sm.icon.inner.size} w-${config.size.sm.icon.inner.size}`]:
              {},
                    },
                },
                //Input:placeload
                '.nui-input-number-placeload': {
                    [`@apply h-${config.size.sm.placeload.size}`]: {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply h-6 w-6': {},
                },
            },
            //Size:md
            '&.nui-input-number-md': {
                //Input:label
                '.nui-input-number-label': {
                    [`@apply pb-1 text-${config.size.md.label.font.size}`]: {},
                },
                //Label:float
                '.nui-label-float': {
                    '@apply top-2.5': {},
                },
                //Input:icon && Input:action
                '.nui-input-number-icon, .nui-input-number-action': {
                    [`@apply h-${config.size.md.icon.outer.size} w-${config.size.md.icon.outer.size}`]:
            {},

                    '.nui-input-number-icon-inner, .nui-input-number-action-inner': {
                        [`@apply h-${config.size.md.icon.inner.size} w-${config.size.md.icon.inner.size}`]:
              {},
                    },
                },
                //Input:placeload
                '.nui-input-number-placeload': {
                    [`@apply h-${config.size.md.placeload.size}`]: {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply  h-8 w-8': {},
                },
            },
            //Size:lg
            '&.nui-input-number-lg': {
                //Input:label
                '.nui-input-number-label': {
                    [`@apply pb-1 text-${config.size.lg.label.font.size}`]: {},
                },
                //Label:float
                '.nui-label-float': {
                    '@apply top-3.5': {},
                },
                //Input:icon && Input:action
                '.nui-input-number-icon, .nui-input-number-action': {
                    [`@apply h-${config.size.lg.icon.outer.size} w-${config.size.lg.icon.outer.size}`]:
            {},

                    '.nui-input-number-icon-inner, .nui-input-number-action-inner': {
                        [`@apply h-${config.size.lg.icon.inner.size} w-${config.size.lg.icon.inner.size}`]:
              {},
                    },
                },
                //Input:placeload
                '.nui-input-number-placeload': {
                    [`@apply h-${config.size.lg.placeload.size}`]: {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply h-10 w-10': {},
                },
            },
            //Color:default
            '&.nui-input-number-default': {
                '.nui-input-number': {
                    //Font
                    [`@apply text-${config.color.default.color.light} dark:text-${config.color.default.color.dark}`]:
            {},
                    //Placeholder
                    [`@apply placeholder:text-${config.color.default.placeholder.light} dark:placeholder:text-${config.color.default.placeholder.dark}`]:
            {},
                    //Background
                    [`@apply bg-${config.color.default.background.light} dark:bg-${config.color.default.background.dark}`]:
            {},
                    //Border
                    [`@apply border border-${config.color.default.border.base.light} dark:border-${config.color.default.border.base.dark}`]:
            {},
                    //Border:hover
                    [`@apply hover:border-${config.color.default.border.hover.light} dark:hover:border-${config.color.default.border.hover.dark}`]:
            {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply bg-white dark:bg-muted-800 enabled:hover:bg-muted-100 dark:enabled:hover:bg-muted-700':
            {},
                    '@apply border border-muted-200 dark:border-muted-700 enabled:focus:bg-muted-100 dark:enabled:focus:bg-muted-800':
            {},
                },
            },
            //Color:defaultContrast
            '&.nui-input-number-default-contrast': {
                '.nui-input-number': {
                    //Font
                    [`@apply text-${config.color.defaultContrast.color.light} dark:text-${config.color.defaultContrast.color.dark}`]:
            {},
                    //Placeholder
                    [`@apply placeholder:text-${config.color.defaultContrast.placeholder.light} dark:placeholder:text-${config.color.defaultContrast.placeholder.dark}`]:
            {},
                    //Background
                    [`@apply bg-${config.color.defaultContrast.background.light} dark:bg-${config.color.defaultContrast.background.dark}`]:
            {},
                    //Border
                    [`@apply border border-${config.color.defaultContrast.border.base.light} dark:border-${config.color.defaultContrast.border.base.dark}`]:
            {},
                    //Border:hover
                    [`@apply hover:border-${config.color.defaultContrast.border.hover.light} dark:hover:border-${config.color.defaultContrast.border.hover.dark}`]:
            {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply bg-white dark:bg-muted-800 enabled:hover:bg-white dark:enabled:hover:bg-muted-900':
            {},
                    '@apply border border-muted-200 dark:border-muted-700 enabled:focus:bg-white dark:enabled:focus:bg-muted-900':
            {},
                },
            },
            //Color:muted
            '&.nui-input-number-muted': {
                '.nui-input-number': {
                    //Font
                    [`@apply text-${config.color.muted.color.light} dark:text-${config.color.muted.color.dark}`]:
            {},
                    //Placeholder
                    [`@apply placeholder:text-${config.color.muted.placeholder.light} dark:placeholder:text-${config.color.muted.placeholder.dark}`]:
            {},
                    //Background
                    [`@apply bg-${config.color.muted.background.light} dark:bg-${config.color.muted.background.dark}`]:
            {},
                    //Border
                    [`@apply border border-${config.color.muted.border.base.light} dark:border-${config.color.muted.border.base.dark}`]:
            {},
                    //Border:hover
                    [`@apply hover:border-${config.color.muted.border.hover.light} dark:hover:border-${config.color.muted.border.hover.dark}`]:
            {},
                },
                //Input:buttons
                '.nui-input-number-buttons button': {
                    '@apply bg-white dark:bg-muted-800 enabled:hover:bg-white dark:enabled:hover:bg-muted-800':
            {},
                    '@apply border border-muted-200 dark:border-muted-700 enabled:focus:bg-white dark:enabled:focus:bg-muted-800':
            {},
                },
            },
            //Color:mutedContrast
            '&.nui-input-number-muted-contrast': {
                '.nui-input-number': {
                    //Font
                    [`@apply text-${config.color.mutedContrast.color.light} dark:text-${config.color.mutedContrast.color.dark}`]:
            {},
                    //Placeholder
                    [`@apply placeholder:text-${config.color.mutedContrast.placeholder.light} dark:placeholder:text-${config.color.mutedContrast.placeholder.dark}`]:
            {},
                    //Background
                    [`@apply bg-${config.color.mutedContrast.background.light} dark:bg-${config.color.mutedContrast.background.dark}`]:
            {},
                    //Border
                    [`@apply border border-${config.color.mutedContrast.border.base.light} dark:border-${config.color.mutedContrast.border.base.dark}`]:
            {},
                    //Border:hover
                    [`@apply hover:border-${config.color.mutedContrast.border.hover.light} dark:hover:border-${config.color.mutedContrast.border.hover.dark}`]:
            {},
                },
            },
            //Input:buttons
            '.nui-input-number-buttons button': {
                '@apply bg-white dark:bg-muted-800 enabled:hover:bg-white dark:enabled:hover:bg-muted-900':
          {},
                '@apply border border-muted-200 dark:border-muted-700 enabled:focus:bg-white dark:enabled:focus:bg-muted-900':
          {},
            },

            //Input:not loading
            '&:not(.nui-input-number-loading)': {
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    [`@apply text-${config.loaded.font.color.light} dark:text-${config.loaded.font.color.dark}`]:
            {},
                },
            },
            //Input:loading
            '&.nui-input-number-loading': {
                '.nui-input-number': {
                    '@apply !text-transparent placeholder:!text-transparent dark:placeholder:!text-transparent':
            {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    '@apply text-transparent': {},
                },
                '.nui-input-number-icon': {
                    '@apply opacity-0': {},
                },
            },
            //Input:label:float
            '&.nui-input-number-label-float': {
                '.nui-input-number': {
                    '@apply placeholder:text-transparent dark:placeholder:text-transparent':
            {},
                },
            },
            //Input:error
            '&.nui-input-number-error': {
                //Border
                '.nui-input-number': {
                    [`@apply !border-${config.error.input.border.light} dark:!border-${config.error.input.border.dark}`]:
            {},
                },
                //Icon
                '.nui-input-number-icon': {
                    [`@apply !text-${config.error.icon.color.light} dark:!text-${config.error.icon.color.dark}`]:
            {},
                },
            },
            //Without icon && Size:sm
            '&:not(.nui-has-icon).nui-input-number-sm': {
                '.nui-input-number': {
                    [`@apply h-8 py-1 text-${config.icon.disabled.input.sm.font.size} leading-4 px-2`]:
            {},
                },
            },
            //With icon && Size:sm
            '&.nui-has-icon.nui-input-number-sm': {
                '.nui-input-number': {
                    [`@apply h-8 py-1 text-${config.icon.enabled.input.sm.font.size} leading-4 pe-3 ps-8`]:
            {},
                },
            },
            //Without icon && Size:md
            '&:not(.nui-has-icon).nui-input-number-md': {
                '.nui-input-number': {
                    [`@apply h-10 py-2 text-${config.icon.disabled.input.md.font.size} leading-5 px-3`]:
            {},
                },
            },
            //With icon && Size:md
            '&.nui-has-icon.nui-input-number-md': {
                '.nui-input-number': {
                    [`@apply h-10 py-2 text-${config.icon.enabled.input.md.font.size} leading-5 pe-4 ps-10`]:
            {},
                },
            },
            //Without icon && Size:lg
            '&:not(.nui-has-icon).nui-input-number-lg': {
                '.nui-input-number': {
                    [`@apply h-12 py-2 text-${config.icon.disabled.input.lg.font.size} leading-5 px-4`]:
            {},
                },
            },
            //With icon && Size:lg
            '&.nui-has-icon.nui-input-number-lg': {
                '.nui-input-number': {
                    [`@apply h-12 py-2 text-${config.icon.enabled.input.lg.font.size} leading-5 pe-4 ps-11`]:
            {},
                },
            },
            //With action && Size:sm
            '&.nui-has-action.nui-input-number-sm': {
                '.nui-input-number': {
                    [`@apply pe-${config.input.action.padding.sm}`]: {},
                },
            },
            //With action && Size:md
            '&.nui-has-action.nui-input-number-md': {
                '.nui-input-number': {
                    [`@apply pe-${config.input.action.padding.md}`]: {},
                },
            },
            //With action && Size:lg
            '&.nui-has-action.nui-input-number-lg': {
                '.nui-input-number': {
                    [`@apply pe-${config.input.action.padding.lg}`]: {},
                },
            },
            //Without icon && Size:sm && Label:float
            '&.nui-input-number-label-float:not(.nui-has-icon).nui-input-number-sm': {
                '.nui-label-float': {
                    [`@apply start-3 -ms-3 -mt-7 text-${config.icon.disabled.label.float.sm.font.size}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    '@apply !-ms-3 !-mt-7': {},
                },

                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    '@apply ms-0 mt-0': {},
                },
            },
            //With icon && Size:sm && Label:float
            '&.nui-input-number-label-float.nui-has-icon.nui-input-number-sm': {
                '.nui-label-float': {
                    [`@apply start-8 -ms-8 -mt-7 text-${config.icon.enabled.label.float.sm.font.size}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    '@apply !-ms-8 !-mt-7': {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    '@apply ms-0 mt-0': {},
                },
            },
            //Without icon && Size:md && Label:float
            '&.nui-input-number-label-float:not(.nui-has-icon).nui-input-number-md': {
                '.nui-label-float': {
                    [`@apply start-3 -ms-3 -mt-8 text-${config.icon.disabled.label.float.md.font.size.base}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    [`@apply !-ms-3 !-mt-8 !text-${config.icon.disabled.label.float.md.font.size.focus}`]:
            {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    [`@apply ms-0 mt-0 text-${config.icon.disabled.label.float.md.font.size.unfocus}`]:
            {},
                },
            },
            //With icon && Size:md && Label:float
            '&.nui-input-number-label-float.nui-has-icon.nui-input-number-md': {
                '.nui-label-float': {
                    [`@apply start-10 -ms-10 -mt-8 text-${config.icon.enabled.label.float.md.font.size.base}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    [`@apply !-ms-10 !-mt-8 !text-${config.icon.enabled.label.float.md.font.size.focus}`]:
            {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    [`@apply ms-0 mt-0 text-${config.icon.enabled.label.float.md.font.size.unfocus}`]:
            {},
                },
            },
            //Without icon && Size:lg && Label:float
            '&.nui-input-number-label-float:not(.nui-has-icon).nui-input-number-lg': {
                '.nui-label-float': {
                    [`@apply start-3 -ms-3 -mt-8 text-${config.icon.disabled.label.float.lg.font.size.base}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    [`@apply !-ms-3 !-mt-9 !text-${config.icon.disabled.label.float.lg.font.size.focus}`]:
            {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    [`@apply ms-0 mt-0 text-${config.icon.disabled.label.float.lg.font.size.unfocus}`]:
            {},
                },
            },
            //With icon && Size:lg && Label:float
            '&.nui-input-number-label-float.nui-has-icon.nui-input-number-lg': {
                '.nui-label-float': {
                    [`@apply start-11 -ms-10 -mt-8 text-${config.icon.enabled.label.float.lg.font.size.base}`]:
            {},
                },
                '.nui-input-number:focus-visible ~ .nui-label-float': {
                    [`@apply !-ms-10 !-mt-9 !text-${config.icon.enabled.label.float.lg.font.size.focus}`]:
            {},
                },
                '.nui-input-number:placeholder-shown ~ .nui-label-float': {
                    [`@apply ms-0 mt-0 text-${config.icon.enabled.label.float.lg.font.size.unfocus}`]:
            {},
                },
            },
        },
    });
}, config);
