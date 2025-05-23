<script setup lang="ts" generic="T extends any = string">
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/vue';
import { Float, FloatContent,FloatReference } from '@headlessui-float/vue';

const props = withDefaults(
    defineProps<{
    /**
     * The items to display in the multiselect.
     */
    items: T[]

    /**
     * The radius of the multiselect.
     *
     * @since 2.0.0
     * @default 'sm'
     */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'

    /**
     * The size of the listbox.
     *
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * The contrast of the listbox.
     *
     * @default 'default'
     */
    contrast?: 'default' | 'default-contrast' | 'muted' | 'muted-contrast'

    /**
     * The label to display for the multiselect.
     */
    label?: string

    /**
     * If the label should be floating.
     */
    labelFloat?: boolean

    /**
     * The icon to display for the multiselect.
     */
    icon?: string

    /**
     * The icon to show when the component is selected.
     */
    selectedIcon?: string

    /**
     * The placeholder text to display when no selection has been made.
     */
    placeholder?: string

    /**
     * An error message or boolean value indicating whether the input is in an error state.
     */
    error?: string | boolean

    /**
     * Whether the multiselect is in a loading state.
     */
    loading?: boolean

    /**
     * Whether the multiselect is disabled.
     */
    disabled?: boolean

    /**
     * Whether the multiselect allows multiple selections.
     */
    multiple?: boolean

    /**
     * The label to display for multiple selections, or a function that returns the label.
     */
    multipleLabel?: string | ((value: T[], labelProperty?: string) => string)

    /**
     * Used a fixed strategy to float the component
     */
    fixed?: boolean

    /**
     * The placement of the component via floating-ui.
     */
    placement?:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'right'
      | 'right-start'
      | 'right-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'

    /**
     * The properties to use for the value, label, sublabel, media, and icon of the options items.
     */
    properties?: {
      /**
       * The property to use for the value of the options.
       */
      value?: T extends object ? keyof T : string

      /**
       * The property to use for the label of the options.
       */
      label?: T extends object ? keyof T : string

      /**
       * The property to use for the sublabel of the options.
       */
      sublabel?: T extends object ? keyof T : string

      /**
       * The property to use for the media of the options.
       */
      media?: T extends object ? keyof T : string

      /**
       * The property to use for the icon of the options.
       */
      icon?: T extends object ? keyof T : string
    }
  }>(),
    {
        rounded: undefined,
        size: undefined,
        contrast: undefined,
        label: '',
        icon: '',
        selectedIcon: 'lucide:check',
        placeholder: '',
        error: false,
        multipleLabel: () => {
            return (value: T[], labelProperty?: string): string => {
                if (value.length === 0) {
                    return 'No elements selected';
                } else if (value.length > 1) {
                    return `${value.length} elements selected`;
                }
                return labelProperty && typeof value?.[0] === 'object'
                    ? String((value?.[0] as any)?.[labelProperty])
                    : String(value?.[0]);
            };
        },
        properties: () => ({}),
        placement: 'bottom-start',
    },
);

const [modelValue, modelModifiers] = defineModel<T | T[], 'prop'>({
    set(value) {
        if (modelModifiers.prop && props.properties.value) {
            const attr = props.properties.value;
            return props.items.find(
                (item) =>
                    item &&
          typeof item === 'object' &&
          attr in item &&
          (item as any)[attr] === value,
            );
        }
        return value;
    },
});

const rounded = useNuiDefaultProperty(props, 'BaseListbox', 'rounded');
const size = useNuiDefaultProperty(props, 'BaseListbox', 'size');
const contrast = useNuiDefaultProperty(props, 'BaseListbox', 'contrast');

const radiuses = {
    none: '',
    sm: 'nui-listbox-rounded',
    md: 'nui-listbox-smooth',
    lg: 'nui-listbox-curved',
    full: 'nui-listbox-full',
} as Record<string, string>;

const sizes = {
    sm: 'nui-listbox-sm',
    md: 'nui-listbox-md',
    lg: 'nui-listbox-lg',
} as Record<string, string>;

const contrasts = {
    default: 'nui-listbox-default',
    'default-contrast': 'nui-listbox-default-contrast',
    muted: 'nui-listbox-muted',
    'muted-contrast': 'nui-listbox-muted-contrast',
} as Record<string, string>;

const placeholder = computed(() => {
    if (props.loading) {
        return;
    }
    if (props.labelFloat) {
        return props.label;
    }

    return props.placeholder;
});

const internal = ref<any>(modelValue);
</script>

<template>
    <div
        class="nui-listbox"
        :class="[
            contrast && contrasts[contrast],
            size && sizes[size],
            rounded && radiuses[rounded],
            props.error && !props.loading && 'nui-listbox-error',
            props.loading && 'nui-listbox-loading',
            props.labelFloat && 'nui-listbox-label-float',
            props.icon && 'nui-has-icon',
        ]"
    >
        <Listbox
            v-slot="{ open }: { open: boolean }"
            v-model="internal"
            :by="modelModifiers.prop ? undefined : props.properties.value"
            :multiple="props.multiple"
            :disabled="props.disabled"
        >
            <Float
                composable
                leave="transition duration-100 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
                flip
                :offset="5"
                :strategy="props.fixed ? 'fixed' : 'absolute'"
                :placement="props.placement"
                :adaptive-width="props.fixed"
                :z-index="20"
            >
                <ListboxLabel
                    v-if="
                        ('label' in $slots && !props.labelFloat) ||
                            (props.label && !props.labelFloat)
                    "
                    class="nui-listbox-label"
                >
                    <slot name="label">
                        {{ props.label }}
                    </slot>
                </ListboxLabel>

                <div class="nui-listbox-outer">
                    <FloatReference>
                        <div>
                            <ListboxButton
                                :disabled="props.disabled"
                                class="nui-listbox-button"
                            >
                                <slot
                                    name="listbox-button"
                                    :value="modelValue"
                                    :open="open"
                                >
                                    <div class="nui-listbox-button-inner">
                                        <BaseIconBox
                                            v-if="props.icon"
                                            size="xs"
                                            rounded="sm"
                                            color="none"
                                            class="nui-icon-box"
                                        >
                                            <slot name="icon">
                                                <Icon
                                                    :name="props.icon"
                                                    class="nui-icon-box-inner"
                                                />
                                            </slot>
                                        </BaseIconBox>

                                        <template v-if="Array.isArray(modelValue)">
                                            <div
                                                v-if="modelValue.length === 0 && placeholder"
                                                class="nui-listbox-placeholder"
                                                :class="props.loading && 'select-none text-transparent'"
                                            >
                                                {{ placeholder }}
                                            </div>
                                            <div
                                                class="block truncate text-left"
                                                :class="[
                                                    props.loading && 'select-none text-transparent',
                                                    modelValue.length === 0 &&
                                                        'text-muted-300 dark:text-muted-500',
                                                ]"
                                            >
                                                {{
                                                    typeof props.multipleLabel === 'function'
                                                        ? props.multipleLabel(
                                                            modelValue,
                                                            props.properties.label,
                                                        )
                                                        : props.multipleLabel
                                                }}
                                            </div>
                                        </template>

                                        <template v-else-if="modelValue">
                                            <BaseAvatar
                                                v-if="
                                                    props.properties.media &&
                                                        (modelValue as any)[props.properties.media]
                                                "
                                                :src="(modelValue as any)[props.properties.media]"
                                                :size="size === 'sm' ? 'xxs' : 'xs'"
                                                class="me-2"
                                                :class="size === 'sm' ? '-ms-1' : '-ms-2'"
                                            />
                                            <BaseIconBox
                                                v-else-if="
                                                    props.properties.icon &&
                                                        (modelValue as any)[props.properties.icon]
                                                "
                                                size="xs"
                                                rounded="sm"
                                                color="none"
                                                class="-ms-2 me-2"
                                            >
                                                <Icon
                                                    :name="(modelValue as any)[props.properties.icon]"
                                                    class="h-4 w-4"
                                                />
                                            </BaseIconBox>
                                            <div
                                                class="truncate text-left"
                                                :class="props.loading && 'select-none text-transparent'"
                                            >
                                                {{
                                                    props.properties.label
                                                        ? (modelValue as any)[props.properties.label]
                                                        : props.properties.value
                                                            ? (modelValue as any)[props.properties.value]
                                                            : modelValue
                                                }}
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div
                                                class="nui-listbox-placeholder"
                                                :class="props.loading && 'select-none text-transparent'"
                                            >
                                                {{ placeholder }}
                                            </div>
                                        </template>

                                        <span class="nui-listbox-chevron nui-chevron">
                                            <Icon
                                                name="lucide:chevron-down"
                                                class="nui-listbox-chevron-inner"
                                                :class="[open && 'rotate-180']"
                                            />
                                        </span>
                                    </div>
                                </slot>
                            </ListboxButton>
                            <ListboxLabel
                                v-if="
                                    ('label' in $slots && props.labelFloat) ||
                                        (props.label && props.labelFloat)
                                "
                                class="nui-label-float"
                                :class="open ? 'nui-label-float-active' : ''"
                            >
                                <slot name="label">
                                    {{ props.label }}
                                </slot>
                            </ListboxLabel>

                            <div
                                v-if="props.loading"
                                class="nui-listbox-placeload nui-loading-placeload"
                                :class="[
                                    (properties.media && size === 'sm') ||
                                        (properties.icon && size === 'sm')
                                        ? 'ms-5'
                                        : '',
                                    (properties.media && size === 'md') ||
                                        (properties.icon && size === 'md')
                                        ? 'ms-6'
                                        : '',
                                    (properties.media && size === 'lg') ||
                                        (properties.icon && size === 'lg')
                                        ? 'ms-7'
                                        : '',
                                ]"
                            >
                                <BasePlaceload class="nui-placeload" />
                            </div>
                        </div>
                    </FloatReference>

                    <FloatContent :class="!props.fixed && 'w-full'">
                        <ListboxOptions class="nui-listbox-options">
                            <ListboxOption
                                v-for="item in props.items"
                                v-slot="{ active, selected }"
                                :key="
                                    props.properties.value
                                        ? (item as any)[props.properties.value]
                                        : item
                                "
                                :value="
                                    modelModifiers.prop && props.properties.value
                                        ? (item as any)[props.properties.value]
                                        : item
                                "
                                as="template"
                            >
                                <li
                                    class="nui-listbox-option group/nui-listbox-option"
                                    :class="[active && 'nui-active']"
                                >
                                    <slot
                                        name="listbox-item"
                                        :item="item"
                                        :open="open"
                                        :active="active"
                                        :selected="selected"
                                    >
                                        <BaseListboxItem
                                            :value="{
                                                value: props.properties.label
                                                    ? (item as any)[props.properties.label]
                                                    : props.properties.value
                                                        ? (item as any)[props.properties.value]
                                                        : (item as any),
                                                label:
                                                    props.properties.label &&
                                                    (item as any)[props.properties.label],
                                                sublabel:
                                                    props.properties.sublabel &&
                                                    (item as any)[props.properties.sublabel],
                                                media:
                                                    props.properties.media &&
                                                    (item as any)[props.properties.media],
                                                icon:
                                                    props.properties.icon &&
                                                    (item as any)[props.properties.icon],
                                            }"
                                            :selected-icon="props.selectedIcon"
                                            :active="active"
                                            :selected="selected"
                                        />
                                    </slot>
                                </li>
                            </ListboxOption>
                        </ListboxOptions>
                    </FloatContent>

                    <span
                        v-if="props.error && typeof props.error === 'string'"
                        class="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none"
                    >
                        {{ props.error }}
                    </span>
                </div>
            </Float>
        </Listbox>
    </div>
</template>

<style scoped>
.nui-listbox .nui-listbox-options {
  position: unset;
  margin-top: unset;
}
</style>
