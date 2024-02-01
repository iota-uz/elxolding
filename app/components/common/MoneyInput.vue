<template>
    <div class="nui-input-wrapper nui-input-default nui-input-md nui-input-rounded">
        <label v-if="props.label" class="nui-input-label">
            {{ props.label }}
        </label>
        <div class="nui-input-outer">
            <div>
                <input
                    ref="input"
                    v-model="value"
                    :placeholder="props.placeholder"
                    class="nui-input"
                    @focus="onFocus"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {formatMoney} from '~/utils/text';

const props = defineProps<{ modelValue: number, label?: string, placeholder?: string }>();
const emit = defineEmits(['update:modelValue']);

const suffixLen = useText('currency.symbol').length + 1;
const input = ref<HTMLInputElement | null>(null);

const value = computed({
    get() {
        return format(props.modelValue);
    },
    set(v: string) {
        if (!input.value) {
            return;
        }
        const numericV = parseInt(v.replace(/\D/g, ''));
        let positionFromEnd = v.length - input.value!.selectionEnd!;
        v = format(numericV);
        input.value.value = v;
        positionFromEnd = Math.max(positionFromEnd, suffixLen);
        positionFromEnd = v.length - positionFromEnd;
        positionFromEnd = Math.max(positionFromEnd, 1);
        emit('update:modelValue', numericV);
        nextTick(() => {
            setCursor(positionFromEnd);
        });
    }
});

function format(v: number) {
    return formatMoney(v, 0, {spaceBetweenAmountAndSymbol: ' ', symbolOnLeft: false});
}

function setCursor(position: number) {
    input.value!.setSelectionRange(position, position);
}

function onFocus() {
    if (!input.value) {
        return;
    }
    const position = input.value.value.length - suffixLen;
    nextTick(() => {
        setCursor(position);
    });
}

</script>

<style>

</style>
