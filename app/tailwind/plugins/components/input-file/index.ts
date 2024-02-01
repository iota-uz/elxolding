import plugin from 'tailwindcss/plugin';

import { defaultConfig, type InputFileConfig, key } from './input-file.config';

const config = {
    theme: {
        nui: {
            [key]: defaultConfig,
        },
    },
};

export default plugin(({ addComponents, theme }) => {
    const config = theme(`nui.${key}`) satisfies InputFileConfig;

    addComponents({
    //Wrapper
        '.nui-input-file': {
            '@apply relative block nui-focus': {},
            //Variant:drop
            '&.nui-input-file-drop': {
                [`@apply relative h-${config.drop.height} flex justify-center items-center`]:
          {},
                //Background
                [`@apply bg-${config.drop.background.light} dark:bg-${config.drop.background.dark}`]:
          {},
                //Border
                [`@apply border-2 border-dashed border-${config.drop.border.base.light} dark:border-${config.drop.border.base.light}`]:
          {},
                //Border:hover
                [`@apply hover:border-${config.drop.border.hover.light} dark:hover:border-${config.drop.border.hover.dark}`]:
          {},
                //Transition
                [`@apply transition-${config.drop.transition.property} duration-${config.drop.transition.duration}`]:
          {},
                //Drop:inner
                '.nui-drop-area-inner': {
                    '@apply absolute z-10': {},
                },
                //Drop:zone
                '.nui-drop-zone': {
                    [`@apply flex flex-col items-center font-${config.drop.zone.font.family} text-${config.drop.zone.font.size}`]:
            {},
                },
                //Zone:icon
                '.nui-drop-zone-icon': {
                    //Base
                    [`@apply w-${config.drop.zone.icon.size} h-${config.drop.zone.icon.size} mb-2`]:
            {},
                    //Color
                    [`@apply text-${config.drop.zone.font.color.base.light} dark:text-${config.drop.zone.font.color.base.dark}`]:
            {},
                    //Transition
                    [`@apply transition-${config.drop.zone.icon.transition.property} duration-${config.drop.zone.icon.transition.duration}`]:
            {},
                },
                //Zone:text
                '.nui-drop-zone-text': {
                    //Base
                    [`@apply block font-${config.drop.zone.font.family} font-${config.drop.zone.font.weight}`]:
            {},
                    //Color
                    [`@apply text-${config.drop.zone.font.color.base.light} dark:text-${config.drop.zone.font.color.base.dark}`]:
            {},
                },
                //Zone:separator
                '.nui-drop-zone-separator': {
                    //Base
                    [`@apply block font-${config.drop.zone.separator.font.family} font-${config.drop.zone.separator.font.weight} leading-none py-1`]:
            {},
                    //Color
                    [`@apply text-${config.drop.zone.font.color.base.light} dark:text-${config.drop.zone.font.color.base.dark}`]:
            {},
                },
                //Zone:input
                '.nui-drop-zone-input': {
                    [`@apply absolute top-0 left-0 h-${config.drop.zone.input.size} w-${config.drop.zone.input.size} opacity-0 file:cursor-pointer z-20`]:
            {},
                },
                //Zone:hover
                '&:hover': {
                    '.nui-drop-zone-icon': {
                        [`@apply text-${config.drop.zone.font.color.hover.light} dark:text-${config.drop.zone.font.color.hover.dark}`]:
              {},
                    },
                },
            },
            //Variant:button
            '&.nui-input-file-button': {
                //Base
                '@apply w-64 max-w-full flex flex-col items-center px-4 py-8 tracking-wide cursor-pointer':
          {},
                //Font
                [`@apply text-${config.button.font.color.base.light} dark:text-${config.button.font.color.base.dark}`]:
          {},
                //Font:hover
                [`@apply hover:text-${config.button.font.color.hover.light} dark:hover:text-${config.button.font.color.hover.dark}`]:
          {},
                //Background
                [`@apply bg-${config.button.background.light} dark:bg-${config.button.background.dark}`]:
          {},
                //Border
                [`@apply border-2 border-${config.button.border.base.light} dark:border-${config.button.border.base.dark}`]:
          {},
                //Border:hover
                [`@apply hover:border-${config.button.border.hover.light} dark:hover:border-${config.button.border.hover.dark}`]:
          {},
                //Transition
                [`@apply transition-${config.button.transition.property} duration-${config.button.transition.duration}`]:
          {},
                //Button:icon
                '.nui-upload-button-icon': {
                    [`@apply w-${config.button.icon.size} h-${config.button.icon.size}`]:
            {},
                },
                //Button:label
                '.nui-upload-button-label': {
                    //Base
                    '@apply block mt-2 leading-normal': {},
                    //Font
                    [`@apply font-${config.button.label.font.family} text-${config.button.label.font.size}`]:
            {},
                },
            },
            //Variant:combo
            '&.nui-input-file-combo': {
                //Base
                [`@apply block font-${config.combo.font.family} p-${config.combo.padding}`]:
          {},
                //Background
                [`@apply bg-${config.combo.background.light} dark:bg-${config.combo.background.dark}`]:
          {},
                //Border
                [`@apply border border-${config.combo.border.light} dark:border-${config.combo.border.dark}`]:
          {},
                //Combo:label
                '.nui-combo-label-text': {
                    [`@apply font-${config.combo.label.font.family} sr-only text-${config.combo.label.font.size}`]:
            {},
                },
                //Combo:input
                '.nui-combo-input': {
                    [`@apply outline-none block w-${config.combo.input.width} file:me-4 file:py-2 file:px-4 file:border-0 file:cursor-pointer file:transition-colors file:duration-300`]:
            {},
                    //Font
                    [`@apply text-${config.combo.input.font.size} text-${config.combo.input.font.color.light} dark:text-${config.combo.input.font.color.dark}`]:
            {},
                    //File
                    [`@apply file:text-${config.combo.input.file.font.size}`]: {},
                    //File colot
                    [`@apply file:text-${config.combo.input.file.font.color.light} dark:file:text-${config.combo.input.file.font.color.dark}`]:
            {},
                    //Background
                    [`@apply file:bg-${config.combo.input.file.background.base.light} dark:file:bg-${config.combo.input.file.background.base.dark}`]:
            {},
                    //Background:hover
                    [`@apply file:hover:bg-${config.combo.input.file.background.hover.light} dark:file:hover:bg-${config.combo.input.file.background.hover.dark}`]:
            {},
                },
            },
            //Rounded:sm
            '&.nui-input-file-rounded': {
                '&.nui-input-file-drop, &.nui-input-file-button': {
                    [`@apply ${config.rounded.sm}`]: {},
                },
                '&.nui-input-file-combo': {
                    [`@apply ${config.rounded.sm}`]: {},
                },
                '&.nui-input-file-combo .nui-combo-input': {
                    [`@apply file:${config.rounded.sm}`]: {},
                },
            },
            //Rounded:md
            '&.nui-input-file-smooth': {
                '&.nui-input-file-drop, &.nui-input-file-button': {
                    [`@apply ${config.rounded.md}`]: {},
                },
                '&.nui-input-file-combo': {
                    [`@apply ${config.rounded.md}`]: {},
                },
                '&.nui-input-file-combo .nui-combo-input': {
                    [`@apply file:${config.rounded.md}`]: {},
                },
            },
            //Rounded:lg
            '&.nui-input-file-curved': {
                '&.nui-input-file-drop, &.nui-input-file-button': {
                    [`@apply ${config.rounded.lg}`]: {},
                },
                '&.nui-input-file-combo': {
                    [`@apply ${config.rounded.lg}`]: {},
                },
                '&.nui-input-file-combo .nui-combo-input': {
                    [`@apply file:${config.rounded.lg}`]: {},
                },
            },
            //Rounded:full
            '&.nui-input-file-full': {
                '&.nui-input-file-drop, &.nui-input-file-button': {
                    [`@apply ${config.rounded.full}`]: {},
                },
                '&.nui-input-file-combo': {
                    [`@apply ${config.rounded.full}`]: {},
                },
                '&.nui-input-file-combo .nui-combo-input': {
                    [`@apply file:${config.rounded.full}`]: {},
                },
            },
        },
    });
}, config);
