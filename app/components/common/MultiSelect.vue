<template>
    <div
        :class="classes"
        class="nui-input-wrapper nui-input-default"
    >
        <label
            v-if="props.label"
            class="nui-input-label"
        >
            {{ props.label }}
        </label>
        <Treeselect
            :class="selectClasses"
            :model-value="props.modelValue"
            :multiple="props.multiple"
            :options="props.options"
            :placeholder="props.placeholder"
            no-options-text="Нет данных"
            class="custom-treeselect"
            @update:model-value="emit('update:modelValue', $event)"
        >
            <template
                v-for="(_, name) in $slots"
                #[name]="slotData"
            >
                <slot
                    :name="name"
                    v-bind="slotData"
                />
            </template>
        </Treeselect>
    </div>
</template>

<script lang="ts" setup>
import '@diyor28/treeselect/dist/vue3-treeselect.css';

import Treeselect from '@diyor28/treeselect';

interface Props {
    modelValue: any;
    label?: string;
    placeholder?: string;
    options?: any[];
    multiple?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: 'Начните печатать...',
    options: () => ([]),
    size: 'md'
});

const emit = defineEmits(['update:modelValue']);

const classes = computed(() => (['nui-input-' + props.size]));
const selectClasses = computed(() => (['treeselect-' + props.size]));
</script>

<style lang="scss">
.treeselect-sm {
    .vue-treeselect__control {
        height: 2rem !important;
    }

    .vue-treeselect__placeholder, .vue-treeselect__single-value {
        line-height: 36px !important;
        font-size: 0.75rem;
    }
}

.treeselect-md {
    .vue-treeselect__control {
        height: 2.5rem !important;
    }

    .vue-treeselect__placeholder, .vue-treeselect__single-value {
        line-height: 36px !important;
        font-size: 0.875rem;
    }
}

.treeselect-lg {
    .vue-treeselect__control {
        height: 3rem !important;
    }

    .vue-treeselect__placeholder, .vue-treeselect__single-value {
        line-height: 43px !important;
        font-size: 1rem;
    }
}

.custom-treeselect {
    .vue-treeselect__control {
        line-height: 20px !important;
        @apply border border-gray-300 rounded-md dark:bg-muted-900 dark:text-white dark:border-muted-700 focus:border-muted-700;
    }

    .vue-treeselect__icon {
        @apply dark:border-l-muted-600 text-primary-400;
    }

    .vue-treeselect__label {
        @apply dark:text-muted-500;
    }

    .vue-treeselect__placeholder {
        @apply dark:text-muted-500;
    }

    .vue-treeselect__single-value {
        @apply dark:text-white dark:bg-muted-900;
    }

    .vue-treeselect__option--highlight {
        @apply dark:bg-muted-700;
    }

    .vue-treeselect__multi-value-item {
        @apply rounded-md dark:text-white border-muted-300 dark:bg-muted-900;
    }

    .vue-treeselect__menu {
        @apply dark:bg-muted-900 dark:text-white dark:border-muted-700;
    }

    .vue-treeselect__checkbox {
        @apply dark:bg-muted-900 dark:border-muted-500;
    }
}
</style>
