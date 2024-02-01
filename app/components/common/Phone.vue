<template>
    <a
        v-if="hyperlink"
        :href="`tel:${props.value}`"
    >{{ formatted }}</a>
    <span v-else>{{ formatted }}</span>
</template>

<script lang="ts" setup>
import {conformToMask} from 'text-mask-core/src';

import {stringToMask} from '~/utils/text';

const props = defineProps<{value: string, hyperlink?: boolean}>();

const formatted = computed(() => {
    return conformToMask(props.value, stringToMask('+### (##) ###-##-##'), {guide: false}).conformedValue;
});
</script>

<style scoped>
</style>
