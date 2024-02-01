<template>
    <BaseInput
        :error="props.error"
        :label="props.label"
        :model-value="props.modelValue"
        :placeholder="props.placeholder"
        :type="hidePass ? 'password' : 'text'"
        icon="ph:key"
        name="password"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #action>
            <button
                class="leading-0 text-muted-400 peer-focus-within:text-primary-500 absolute end-0 top-0 flex h-10 w-10 items-center justify-center text-center text-xl"
                @click.prevent="hidePass = !hidePass"
            >
                <div
                    :data-nui-tooltip="`${hidePass ? 'Показать' : 'Скрыть'} пароль`"
                    class="relative flex h-full w-full items-center justify-center"
                >
                    <Icon
                        :name="hidePass ? 'ph:eye' : 'ph:eye-slash'"
                        class="h-5 w-5"
                    />
                </div>
            </button>
        </template>
    </BaseInput>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string, label?: string, placeholder?: string, error?: string }>();
const emit = defineEmits(['update:modelValue']);

const hidePass = ref(true);
</script>

<style scoped>

</style>
