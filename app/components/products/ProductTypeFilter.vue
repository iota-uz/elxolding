<template>
    <div class="flex items-center">
        <BaseButton
            v-if="props.modelValue.length"
            class="!px-3 !rounded-r-none !border-e-0"
            @click="clear()"
        >
            <Icon name="ph:x" />
        </BaseButton>
        <BaseDropdown
            :class="{'selected': props.modelValue.length}"
            class="task-type-filter"
            flavor="button"
            label="Статус"
            orientation="start"
        >
            <BaseDropdownItem
                v-for="option in options"
                :key="option.value"
                :classes="{title: 'py-1'}"
                :title="option.label"
                @click.stop="select(option.value)"
            >
                <template #start>
                    <BaseCheckbox
                        :model-value="isSelected(option.value)"
                        @click.stop="select(option.value)"
                    />
                </template>
            </BaseDropdownItem>
        </BaseDropdown>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits(['update:modelValue']);
const options = [
    {label: 'На складе', value: 'in_stock'},
    {label: 'В разработке', value: 'in_development'},
    {label: 'Одобрено', value: 'approved'},
];

function select(v: string) {
    if (props.modelValue.includes(v)) {
        emit('update:modelValue', props.modelValue.filter((i) => i !== v));
    } else {
        emit('update:modelValue', [...props.modelValue, v]);
    }
}

function isSelected(v: string) {
    return props.modelValue.includes(v);
}

function clear() {
    emit('update:modelValue', []);
}
</script>

<style lang="scss">
.selected {
    button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
}

.task-type-filter {
    button {
        font-size: 12px !important;
        padding: 0 8px !important;
    }

    @media (min-width: 768px) {
        button {
            font-size: 14px !important;
            padding: 0 12px !important;
        }
    }
}
</style>
