<script setup lang="ts" generic="T extends any = boolean">
defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(
    defineProps<{
    /**
     * The value of the radio input.
     */
    value?: T

    /**
     * The form input identifier.
     */
    id?: string

    /**
     * The label for the radio input.
     */
    label?: string

    /** The color of the radio.*/
    color?:
      | 'default'
      | 'light'
      | 'muted'
      | 'primary'
      | 'info'
      | 'success'
      | 'warning'
      | 'danger'

    /**
     * An error message to display below the radio label.
     */
    error?: string | boolean

    /**
     * Classes to apply to the various parts of the radio input.
     */
    classes?: {
      /**
       * Classes to apply to the wrapper element of the radio input.
       */
      wrapper?: string | string[]

      /**
       * Classes to apply to the label element of the radio input.
       */
      label?: string | string[]

      /**
       * Classes to apply to the dot element inside the radio input.
       */
      inputDot?: string | string[]

      /**
       * Classes to apply to the background element inside the radio input.
       */
      inputBg?: string | string[]
    }
  }>(),
    {
        value: undefined,
        id: undefined,
        label: undefined,
        color: undefined,
        error: undefined,
        classes: () => ({}),
    },
);
const [modelValue] = defineModel<T>();

const color = useNuiDefaultProperty(props, 'BaseRadio', 'color');

const inputRef = ref<HTMLInputElement>();
const id = useNinjaId(() => props.id);

const colors = {
    default: 'nui-radio-default',
    light: 'nui-radio-light',
    muted: 'nui-radio-muted',
    primary: 'nui-radio-primary',
    info: 'nui-radio-info',
    success: 'nui-radio-success',
    warning: 'nui-radio-warning',
    danger: 'nui-radio-danger',
} as Record<string, string>;

defineExpose({
    /**
   * The underlying HTMLInputElement element.
   */
    el: inputRef,

    /**
   * The internal id of the radio input.
   */
    id,
});
</script>

<template>
    <div
        class="nui-radio"
        :class="[color && colors[color], props.classes?.wrapper]"
    >
        <div class="nui-radio-outer">
            <input
                :id="id"
                ref="inputRef"
                v-model="modelValue"
                v-bind="$attrs"
                type="radio"
                :value="props.value"
                class="nui-radio-input"
            >
            <div
                :class="props.classes?.inputBg"
                class="nui-radio-inner"
            />
            <div
                :class="props.classes?.inputDot"
                class="nui-radio-dot"
            />
        </div>
        <div class="nui-radio-label-wrapper">
            <label
                v-if="props.label || 'default' in $slots"
                :for="id"
                :class="props.classes?.label"
                class="nui-radio-label-text"
            >
                <slot>{{ props.label }}</slot>
            </label>
            <div
                v-if="props.error && typeof props.error === 'string'"
                class="nui-radio-error"
            >
                {{ props.error }}
            </div>
        </div>
    </div>
</template>
