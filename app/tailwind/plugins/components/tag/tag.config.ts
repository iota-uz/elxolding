export const key = 'tag' as const;

export const defaultConfig = {
    rounded: {
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    },
    padding: {
        x: '3',
    },
    font: {
        family: 'sans',
    },
    size: {
        sm: {
            padding: {
                y: '1',
            },
            font: {
                size: '[0.65rem]',
            },
        },
        md: {
            padding: {
                y: '1.5',
            },
            font: {
                size: 'xs',
            },
        },
    },
    variant: {
        solid: {
            default: {
                font: {
                    color: {
                        light: 'muted-600',
                        dark: 'muted-300',
                    },
                },
                background: {
                    light: 'white',
                    dark: 'muted-800',
                },
                border: {
                    light: 'muted-300',
                    dark: 'muted-700',
                },
                shadow: {
                    size: 'xl',
                },
            },
            muted: {
                font: {
                    color: {
                        light: 'muted-500',
                        dark: 'muted-200',
                    },
                },
                background: {
                    light: 'muted-100',
                    dark: 'muted-800',
                },
                shadow: {
                    size: 'xl',
                },
            },
            primary: {
                font: {
                    color: {
                        light: 'white',
                        dark: 'white',
                    },
                },
                background: {
                    light: 'primary-500',
                    dark: 'primary-500',
                },
                shadow: {
                    size: 'xl',
                    light: 'primary-500/30',
                    dark: 'primary-500/20',
                },
            },
            info: {
                font: {
                    color: {
                        light: 'white',
                        dark: 'white',
                    },
                },
                background: {
                    light: 'info-500',
                    dark: 'info-500',
                },
                shadow: {
                    size: 'xl',
                    light: 'info-500/30',
                    dark: 'info-500/20',
                },
            },
            success: {
                font: {
                    color: {
                        light: 'white',
                        dark: 'white',
                    },
                },
                background: {
                    light: 'success-500',
                    dark: 'success-500',
                },
                shadow: {
                    size: 'xl',
                    light: 'success-500/30',
                    dark: 'success-500/20',
                },
            },
            warning: {
                font: {
                    color: {
                        light: 'white',
                        dark: 'white',
                    },
                },
                background: {
                    light: 'warning-500',
                    dark: 'warning-500',
                },
                shadow: {
                    size: 'xl',
                    light: 'warning-500/30',
                    dark: 'warning-500/20',
                },
            },
            danger: {
                font: {
                    color: {
                        light: 'white',
                        dark: 'white',
                    },
                },
                background: {
                    light: 'danger-500',
                    dark: 'danger-500',
                },
                shadow: {
                    size: 'xl',
                    light: 'danger-500/30',
                    dark: 'danger-500/20',
                },
            },
        },
        pastel: {
            primary: {
                background: {
                    light: 'primary-500/20',
                    dark: 'primary-500/10',
                },
                font: {
                    color: {
                        light: 'primary-500',
                        dark: 'primary-500',
                    },
                },
            },
            info: {
                background: {
                    light: 'info-500/20',
                    dark: 'info-500/10',
                },
                font: {
                    color: {
                        light: 'info-500',
                        dark: 'info-500',
                    },
                },
            },
            success: {
                background: {
                    light: 'success-500/20',
                    dark: 'success-500/10',
                },
                font: {
                    color: {
                        light: 'success-500',
                        dark: 'success-500',
                    },
                },
            },
            warning: {
                background: {
                    light: 'warning-500/20',
                    dark: 'warning-500/10',
                },
                font: {
                    color: {
                        light: 'warning-500',
                        dark: 'warning-500',
                    },
                },
            },
            danger: {
                background: {
                    light: 'danger-500/20',
                    dark: 'danger-500/10',
                },
                font: {
                    color: {
                        light: 'danger-500',
                        dark: 'danger-500',
                    },
                },
            },
        },
        outline: {
            primary: {
                background: {
                    light: 'transparent',
                    dark: 'transparent',
                },
                border: {
                    light: 'primary-500',
                    dark: 'primary-500',
                },
                font: {
                    color: {
                        light: 'primary-500',
                        dark: 'primary-500',
                    },
                },
            },
            info: {
                background: {
                    light: 'transparent',
                    dark: 'transparent',
                },
                border: {
                    light: 'info-500',
                    dark: 'info-500',
                },
                font: {
                    color: {
                        light: 'info-500',
                        dark: 'info-500',
                    },
                },
            },
            success: {
                background: {
                    light: 'transparent',
                    dark: 'transparent',
                },
                border: {
                    light: 'success-500',
                    dark: 'success-500',
                },
                font: {
                    color: {
                        light: 'success-500',
                        dark: 'success-500',
                    },
                },
            },
            warning: {
                background: {
                    light: 'transparent',
                    dark: 'transparent',
                },
                border: {
                    light: 'warning-500',
                    dark: 'warning-500',
                },
                font: {
                    color: {
                        light: 'warning-500',
                        dark: 'warning-500',
                    },
                },
            },
            danger: {
                background: {
                    light: 'transparent',
                    dark: 'transparent',
                },
                border: {
                    light: 'danger-500',
                    dark: 'danger-500',
                },
                font: {
                    color: {
                        light: 'danger-500',
                        dark: 'danger-500',
                    },
                },
            },
        },
    },
    transition: {
        property: 'all',
        duration: '300',
    },
};

export type TagConfig = typeof defaultConfig
export interface TagPluginConfig {
  [key]: TagConfig
}
