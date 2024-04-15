<template>
    <div class="nui-input-wrapper nui-input-default nui-input-md nui-input-rounded">
        <label
            v-if="props.label"
            class="nui-input-label"
            for="file"
        >
            {{ props.label }}
        </label>
        <div
            class="block border border-dashed border-primary-500 bg-blue-50 dark:bg-muted-900 p-4 rounded-md text-center text-sm text-gray-500 cursor-pointer"
        >
            <div class="flex flex-wrap gap-5">
                <div
                    v-if="file && file.id"
                    class="relative p-3 border border-dashed border-primary-500 rounded-lg"
                >
                    <img
                        :src="file.url"
                        alt="photo"
                        class="w-20 aspect-square object-contain"
                    >
                    <Icon
                        class="top-1 right-1 absolute"
                        name="ph:x"
                        size="18"
                        @click="removeFile(file.id)"
                    />
                </div>
            </div>
            <label class="flex flex-col w-full cursor-pointer">
                <input
                    id="file"
                    :accept="props.accept"
                    class="hidden"
                    type="file"
                    @change="uploadFile"
                >
                <span>Перетащить или <span class="text-blue-500 underline">выбрать</span></span>
                <span v-if="description">{{ description }}</span>
            </label>
        </div>
    </div>
</template>

<script lang="ts" setup>

const emit = defineEmits(['update:modelValue', 'fileChange', 'update:files']);
const props = withDefaults(
    defineProps<{
        modelValue: number,
        accept?: string
        label?: string,
        description?: string
    }>(),
    {
        accept: '.jpeg, .png, .webp, .gif',
        label: 'Загрузить файл',
        description: 'Допустимые форматы: .jpeg, .png, .webp, .gif'
    }
);

const uploadsService = useService('uploads', {auth: true});
const file = ref<Record<string, any>>({});
const toast = useToast('GlobalToast');

function updateValue(file: any) {
    emit('update:files', file);
    emit('update:modelValue', file ? file.id : null);
}

async function uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
        return;
    }
    const file = target.files[0];
    updateValue(await processFile(file));
}

async function processFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const uri = await new Promise((resolve) => {
        reader.addEventListener('load', () => resolve(reader.result), false);
    });
    return uploadsService.create({file: uri}).exec();
}

async function removeFile(id: string) {
    try {
        await uploadsService.remove(id).exec();
        updateValue(null);
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    }
}

async function fetch() {
    if (!props.modelValue) {
        return;
    }
    file.value = await uploadsService.get(props.modelValue.toString()).exec();
}

onMounted(() => fetch());

watch(() => props.modelValue, () => {
    fetch();
});
</script>

<style scoped>

</style>
