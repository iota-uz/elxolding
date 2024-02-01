<template>
    <div class="flex items-center">
        <BaseButton v-if="selected" @click="update()"
                    class="!px-3 !rounded-r-none !border-e-0">
            <Icon name="ph:x"></Icon>
        </BaseButton>
        <BaseDropdown
            :class="{'date-filter': selected}"
            flavor="button"
            :label="selected || props.label"
            orientation="start"
        >
            <BaseDropdownItem v-for="option in options"
                              @click="update(option)"
                              :key="option.label"
                              :title="option.label"
            />
        </BaseDropdown>
    </div>
</template>

<script lang="ts" setup>
import moment from 'moment';

const props = defineProps<{ label: string }>();
const emit = defineEmits(['update:start', 'update:end']);

interface Option {
    label: string
    value: moment.Moment[]
}

const options = ref<Option[]>([
    {
        label: 'Сегодня',
        value: [moment().startOf('day'), moment().endOf('day')]
    },
    {
        label: 'Вчера',
        value: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]
    },
    {
        label: 'На этой неделе',
        value: [moment().subtract(1, 'week').startOf('day'), moment().endOf('day')]
    },
    {
        label: 'Прошедшая неделя',
        value: [moment().subtract(2, 'week').startOf('day'), moment().subtract(1, 'week').endOf('day')]
    },
    {
        label: 'В этом месяце',
        value: [moment().subtract(1, 'month').startOf('day'), moment().endOf('day')]
    },
]);
const selected = ref('');
const date = reactive({start: '', end: ''});

function update(option?: Option) {
    selected.value = option?.label || '';
    if (option) {
        const [s, e] = option.value;
        date.start = s.toISOString();
        date.end = e.toISOString();
    } else {
        date.start = '';
        date.end = '';
    }
    emit('update:start', date.start);
    emit('update:end', date.end);
}
</script>

<style lang="scss">
.date-filter {
    button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
}

</style>
