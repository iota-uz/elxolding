import type { TextareaVariant } from './textarea.types';

export const rounded = {
    none: '',
    sm: 'nui-textarea-rounded',
    md: 'nui-textarea-smooth',
    lg: 'nui-textarea-curved',
    full: 'nui-textarea-full',
} as const satisfies TextareaVariant<'rounded'>;

export const size = {
    sm: 'nui-textarea-sm',
    md: 'nui-textarea-md',
    lg: 'nui-textarea-lg',
} as const satisfies TextareaVariant<'size'>;

export const contrast = {
    default: 'nui-textarea-default',
    'default-contrast': 'nui-textarea-default-contrast',
    muted: 'nui-textarea-muted',
    'muted-contrast': 'nui-textarea-muted-contrast',
} as const satisfies TextareaVariant<'contrast'>;
