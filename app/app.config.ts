export default defineAppConfig({
    pagination: {
        defaultPageSize: 25,
    },
    tairo: {
        collapse: {
            circularMenu: {
                enabled: false,
                tools: [],
            },
            toolbar: {
                enabled: true,
                showTitle: true,
                showNavBurger: true,
                tools: [],
            },
            navigation: {
                enabled: true,
                items: [
                    {
                        name: 'Панель управления',
                        icon: {
                            name: 'ph:gauge',
                            class: 'w-5 h-5'
                        },
                        to: '/',
                    },
                    {
                        name: 'Заявки',
                        icon: {
                            name: 'ph:archive-tray-fill',
                            class: 'w-5 h-5'
                        },
                        to: '/orders',
                    },
                    {
                        name: 'Продукция',
                        icon: {
                            name: 'ph:package-fill',
                            class: 'w-5 h-5'
                        },
                        to: '/products'
                    },
                    {
                        name: 'Наименования',
                        icon: {
                            name: 'ph:notepad-fill',
                            class: 'w-5 h-5'
                        },
                        to: '/positions'
                    },
                    {
                        name: 'Пользователи',
                        icon: {
                            name: 'ph:users',
                            class: 'w-5 h-5'
                        },
                        to: '/users'
                    },
                    {
                        name: 'Инвентаризация',
                        icon: {
                            name: 'ph:list-checks-fill',
                            class: 'w-5 h-5'
                        },
                        to: '/inventory'
                    },
                    {
                        name: 'Divider',
                        divider: true,
                    },
                    {
                        name: 'Выйти',
                        icon: {name: 'ph:sign-out', class: 'w-5 h-5'},
                        to: '/logout'
                    },
                ],
            },
        },
    },
    nui: {
        BaseAccordion: {
            rounded: 'sm',
            action: 'dot',
        },
        BaseAutocomplete: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseAutocompleteItem: {
            rounded: 'sm',
        },
        BaseAvatar: {
            size: 'sm',
            rounded: 'full',
        },
        BaseAvatarGroup: {
            limit: 4,
            size: 'sm',
        },
        BaseButton: {
            variant: 'solid',
            rounded: 'sm',
            color: 'default',
            size: 'md',
        },
        BaseButtonAction: {
            rounded: 'sm',
            color: 'default',
        },
        BaseButtonClose: {
            rounded: 'full',
        },
        BaseButtonIcon: {
            rounded: 'sm',
            color: 'default',
            size: 'md',
        },
        BaseCard: {
            rounded: 'sm',
            color: 'white',
        },
        BaseCheckbox: {
            rounded: 'sm',
            color: 'default',
        },
        BaseCheckboxAnimated: {
            color: 'primary',
        },
        BaseDropdown: {
            variant: 'button',
            buttonColor: 'default',
            color: 'white',
            rounded: 'sm',
            size: 'md',
        },
        BaseDropdownItem: {
            rounded: 'sm',
            color: 'default',
        },
        BaseHeading: {
            as: 'p',
            size: 'xl',
            weight: 'semibold',
            lead: 'normal',
        },
        BaseIconBox: {
            variant: 'solid',
            color: 'default',
            size: 'xs',
            rounded: 'sm',
        },
        BaseInput: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseInputFile: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseInputNumber: {
            inputmode: 'numeric',
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseListbox: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseMessage: {
            type: 'success',
            rounded: 'sm',
            closable: false,
        },
        BasePagination: {
            rounded: 'sm',
        },
        BaseParagraph: {
            as: 'p',
            size: 'md',
            weight: 'normal',
            lead: 'normal',
        },
        BasePlaceholderPage: {
            imageSize: 'xs',
        },
        BaseProgress: {
            size: 'sm',
            contrast: 'default',
            color: 'primary',
            rounded: 'full',
        },
        BaseProse: {
            rounded: 'md',
        },
        BaseRadio: {
            color: 'default',
        },
        BaseSelect: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseSnack: {
            size: 'md',
            color: 'muted',
        },
        BaseSwitchBall: {
            color: 'primary',
        },
        BaseSwitchThin: {
            color: 'primary',
        },
        BaseTabs: {
            type: 'tabs',
            justify: 'start',
        },
        BaseTabSlider: {
            justify: 'start',
            size: 'md',
            rounded: 'lg',
        },
        BaseTag: {
            variant: 'solid',
            color: 'default',
            size: 'md',
            rounded: 'lg',
        },
        BaseText: {
            size: 'md',
            weight: 'normal',
            lead: 'normal',
        },
        BaseTextarea: {
            rounded: 'sm',
            size: 'md',
            contrast: 'default',
        },
        BaseTreeSelectItem: {
            rounded: 'sm',
        },
        defaultShapes: {
            accordion: 'rounded',
            autocompleteItem: 'rounded',
            avatar: 'full',
            button: 'rounded',
            buttonAction: 'rounded',
            buttonIcon: 'rounded',
            buttonClose: 'full',
            card: 'rounded',
            dropdown: 'rounded',
            iconBox: 'rounded',
            input: 'rounded',
            message: 'curved',
            pagination: 'rounded',
            progress: 'full',
            prose: 'rounded',
            tabSlider: 'rounded',
            tag: 'rounded',
        },
    }
});
