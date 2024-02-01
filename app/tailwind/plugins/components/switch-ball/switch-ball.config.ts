export const key = 'switchBall' as const;

export const defaulConfig = {
    input: {
        size: 'full',
    },
    handle: {
        size: '5',
        rounded: 'rounded-full',
        border: {
            light: 'muted-300',
            dark: 'muted-600',
        },
        background: {
            light: 'white',
            dark: 'muted-700',
        },
        transition: {
            property: 'all',
            duration: '300',
        },
    },
    track: {
        rounded: 'rounded-full',
        background: {
            light: 'muted-300',
            dark: 'muted-600',
        },
        transition: {
            property: 'all',
            duration: '300',
        },
    },
    icon: {
        size: '2.5',
        color: {
            light: 'white',
            dark: 'white',
        },
        transition: {
            property: 'all',
            duration: '300',
        },
    },
    label: {
        single: {
            font: {
                family: 'sans',
                size: 'sm',
                color: {
                    light: 'muted-400',
                    dark: 'muted-400',
                },
            },
        },
        dual: {
            label: {
                font: {
                    family: 'sans',
                    weight: 'medium',
                    size: 'sm',
                    color: {
                        light: 'muted-800',
                        dark: 'white',
                    },
                },
            },
            sublabel: {
                font: {
                    family: 'sans',
                    size: 'xs',
                    color: {
                        light: 'muted-400',
                        dark: 'muted-400',
                    },
                },
            },
        },
    },
    color: {
        primary: {
            light: 'primary-400',
            dark: 'primary-400',
        },
        info: {
            light: 'info-400',
            dark: 'info-400',
        },
        success: {
            light: 'success-400',
            dark: 'success-400',
        },
        warning: {
            light: 'warning-400',
            dark: 'warning-400',
        },
        danger: {
            light: 'danger-400',
            dark: 'danger-400',
        },
    },
};

export type SwitchBallConfig = typeof defaulConfig
export interface SwitchBallPluginConfig {
  [key]: SwitchBallConfig
}
