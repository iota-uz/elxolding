<template>
    <span>{{ formatMoney(props.value, 0, {spaceBetweenAmountAndSymbol: ' ', symbolOnLeft: false}) }}</span>
</template>

<script lang="ts" setup>
import {formatMoney} from '~/utils/text';

const props = defineProps<{ value: number }>();
</script>
