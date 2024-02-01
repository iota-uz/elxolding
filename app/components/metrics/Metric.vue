<template>
    <BaseCard class="p-4 flex-1 space-y-2">
        <BaseHeading
            as="h2"
            size="md"
            weight="semibold"
        >
            <span>{{ props.title }}</span>
        </BaseHeading>
        <p class="text-4xl">
            {{ props.value }}
        </p>
    </BaseCard>
</template>

<script lang="ts" setup>

const props = defineProps<{value: number | string, title: string}>();
</script>

<style scoped>

</style>
