<template>
    <label
        class="block border border-dashed border-primary-500 bg-blue-50 dark:bg-muted-900 p-4 rounded-md text-center text-sm text-gray-500 cursor-pointer"
    >
        <FileForm
            class="hidden"
            @fileUpload="updateValue"
        />
        Перетащить или <span class="text-blue-500 underline">выбрать</span>
    </label>
</template>

<script lang="ts" setup>
import FileForm from '~/components/common/FileForm.vue';

const emit = defineEmits(['update:modelValue', 'fileChange']);

function updateValue(file: any) {
    emit('update:modelValue', file.id);
    emit('fileChange', file);
}
</script>

<style scoped>

</style>
