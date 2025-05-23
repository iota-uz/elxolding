import type { IconBoxVariant } from './icon-box.types';

export const rounded = {
    none: '',
    sm: 'nui-box-rounded',
    md: 'nui-box-smooth',
    lg: 'nui-box-curved',
    full: 'nui-box-full',
} as const satisfies IconBoxVariant<'rounded'>;

export const size = {
    xs: 'nui-box-xs',
    sm: 'nui-box-sm',
    md: 'nui-box-md',
    lg: 'nui-box-lg',
    xl: 'nui-box-xl',
    '2xl': 'nui-box-2xl',
} as const satisfies IconBoxVariant<'size'>;

export const variant = {
    solid: 'nui-box-solid',
    pastel: 'nui-box-pastel',
    outline: 'nui-box-outline',
} as const satisfies IconBoxVariant<'variant'>;

export const color = {
    default: 'nui-box-default',
    invert: 'nui-box-invert',
    primary: 'nui-box-primary',
    info: 'nui-box-info',
    success: 'nui-box-success',
    warning: 'nui-box-warning',
    danger: 'nui-box-danger',
} as const satisfies IconBoxVariant<'color'>;

export const mask = {
    hex: 'nui-mask nui-mask-hex',
    hexed: 'nui-mask nui-mask-hexed',
    deca: 'nui-mask nui-mask-deca',
    blob: 'nui-mask nui-mask-blob',
    diamond: 'nui-mask nui-mask-diamond',
} as const satisfies IconBoxVariant<'mask'>;
