<template>
    <div class="flex">
        <BaseButton class="flex items-center !px-3 !rounded-r-none !border-e-0">
            {{ props.modelValue }}
        </BaseButton>
        <BaseDropdown
            class="per-page-select"
            flavor="button"
            label="На страницу"
            orientation="start"
        >
            <BaseDropdownItem
                v-for="option in options"
                :key="option"
                :title="option.toString()"
                @click="emit('update:modelValue', option)"
            />
        </BaseDropdown>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);
const options = [10, 25, 50, 100];
</script>

<style lang="scss">
.per-page-select {
    button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
}
</style>
