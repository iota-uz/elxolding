<template>
    <div class="flex flex-col md:flex-row gap-2">
        <BaseInput
            v-model="searchQ"
            :classes="{wrapper: showSelect ? 'md:w-4/5' : 'w-full'}"
            icon="ph:list-magnifying-glass"
            placeholder="Поиск"
            size="lg"
        />
        <MultiSelect
            v-if="showSelect"
            v-model="selected"
            :options="options"
            class="custom-treeselect md:w-1/5"
            multiple
            placeholder="Поиск по ..."
            size="lg"
        />
    </div>
</template>

<script lang="ts" setup>
import MultiSelect from '~/components/common/MultiSelect.vue';
import {debounce as deb} from '~/utils/search';

interface Props {
    modelValue: Record<string, any>;
    reOptions: string;
    debounce: number;
    fields: { key: string, label: string }[];
}

const props = withDefaults(defineProps<Props>(), {reOptions: 'i'});
const emit = defineEmits(['update:modelValue']);

const searchQ = ref('');
const selected = ref<string[]>([]);

const options = computed(() => {
    return props.fields.map((field) => {
        return {id: field.key, label: field.label};
    });
});

watch([searchQ, selected], deb(update, props.debounce));
onMounted(() => {
    selected.value = props.fields.map(v => v.key);
});

const showSelect = computed(() => {
    return props.fields.length > 1;
});


function toQ(v: string) {
    return {[v]: {$iLike: `%${searchQ.value}%`}};
}


function update() {
    if (!searchQ.value.length || !selected.value.length) {
        return emit('update:modelValue', {});
    }
    let query: Record<string, any>;
    if (!showSelect.value && searchQ.value) {
        query = {...toQ(selected.value[0])};
    } else {
        query = {$or: selected.value.map(toQ)};
    }
    emit('update:modelValue', query);
}
</script>

<style lang="scss">
</style>
