<script setup lang="ts">
import { MenuItem } from '@headlessui/vue';
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
    defineProps<{
    /**
     * The route to navigate to when the button is clicked.
     */
    to?: RouteLocationRaw

    /** Using href instead of to result in a native anchor with no router functionality. */
    href?: string

    /**
     * The value for the `rel` attribute on the button.
     */
    rel?: string

    /**
     * The value for the `target` attribute on the button.
     */
    target?: string

    /**
     * The type of button.
     */
    type?: 'button' | 'submit' | 'reset'

    /**
     * The radius of the dropdown-item.
     *
     * @since 2.0.0
     * @default 'sm'
     */
    rounded?: 'none' | 'sm' | 'md' | 'lg'

    /**
     * The color of the dropdown-item.
     *
     * @default 'default'
     */
    color?: 'default' | 'contrast'

    /**
     * The title to display for the dropdown item.
     */
    title?: string

    /**
     * The text to display for the dropdown item.
     */
    text?: string

    /**
     * Optional CSS classes to apply to the wrapper and inner elements.
     */
    classes?: {
      title?: string | string[]
      text?: string | string[]
    }

    /**
     * Whether the button is disabled.
     */
    disabled?: boolean
  }>(),
    {
        to: undefined,
        href: undefined,
        rel: undefined,
        target: undefined,
        type: undefined,
        rounded: undefined,
        color: undefined,
        title: undefined,
        text: undefined,
        classes: () => ({
            title:
        'font-heading text-muted-800 text-xs font-semibold leading-tight dark:text-white',
            text: 'text-muted-400 font-sans text-xs',
        }),
    },
);

const radiuses = {
    none: '',
    sm: 'nui-item-rounded',
    md: 'nui-item-smooth',
    lg: 'nui-item-curved',
} as Record<string, string>;

const colors = {
    default: 'nui-item-default',
    contrast: 'nui-item-contrast',
} as Record<string, string>;

const { is, attributes } = useNinjaButton(props);
</script>

<template>
    <MenuItem
        v-slot="{ active, close }: { active: boolean; close: () => void }"
        as="div"
    >
        <component
            :is="is"
            v-bind="attributes"
            class="nui-dropdown-item"
            :class="[
                active && 'nui-active',
                props.rounded && radiuses[props.rounded],
                props.color && colors[props.color],
            ]"
            @click.passive="close"
        >
            <slot name="start"></slot>
            <div class="nui-item-content">
                <div :class="props.classes.title">
                    <slot>{{ props.title }}</slot>
                </div>
                <p
                    v-if="'text' in $slots || props.text"
                    class="text-muted-400 font-sans text-xs"
                >
                    <slot name="text">{{ props.text }}</slot>
                </p>
            </div>
            <slot name="end"></slot>
        </component>
    </MenuItem>
</template>
