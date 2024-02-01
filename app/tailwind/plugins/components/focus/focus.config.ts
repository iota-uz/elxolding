export const key = 'focus' as const;

export const defaultConfig = {
    offset: '2',
    width: '2',
    style: 'dashed',
    color: {
        light: 'muted-300',
        dark: 'muted-600',
    },
    mode: 'always' as 'always' | 'focus-visible',
};

export type FocusConfig = typeof defaultConfig
export interface FocusPluginConfig {
  [key]: FocusConfig
}
