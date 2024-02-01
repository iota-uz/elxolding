<template>
    <input
        type="file"
        @change="uploadFile"
    >
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue', 'fileChange']);

function updateValue(image: any) {
    emit('update:modelValue', image.id);
    emit('fileChange', image);
}

async function uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files)
        return;
    const file = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const uri = await new Promise((resolve) => {
        reader.addEventListener('load', () => resolve(reader.result), false);
    });
    const upload = await useService<any>('uploads', {auth: true}).create({file: uri}).exec();
    updateValue(upload.file);
}
</script>

<style scoped>

</style>
