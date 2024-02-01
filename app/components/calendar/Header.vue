<template>
    <div class="calendar-header">
        <button @click="prevDate">
            <IconChevronLeft />
        </button>
        <h2>{{ formattedMonthAndYear }}</h2>
        <BaseSelect
            v-model="viewType"
            label="View type"
            :model-value="viewType"
            @update:modelValue="changeView"
        >
            <option
                v-for="option in options"
                :value="option.id"
            >
                {{ option.label }}
            </option>
        </BaseSelect>
        <button @click="nextDate">
            <IconChevronRight />
        </button>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    currentDate: Date;
    viewType: string;
}>();

const emit = defineEmits(['change-date', 'change-view']);

const formattedMonthAndYear = computed(() => {
    return props.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const currentDate = ref(props.currentDate);
const viewType = ref(props.viewType);

const options = ref([
    {id: 'monthly', label: 'Monthly'},
    {id: 'weekly', label: 'Weekly'},
    {id: 'daily', label: 'Daily'},
]);

const prevMonth = () => {
    emit('change-date', new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() - 1));
};

const nextMonth = () => {
    emit('change-date', new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1));
};

const getWeekStartEndDates = (date: Date): { start: Date, end: Date } => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (date.getDay() + 6) % 7); // Set to the first day of the week (Monday)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Sunday)

    currentDate.value = startOfWeek;
    emit('change-date', startOfWeek);

    return { start: startOfWeek, end: endOfWeek };
};

const prevWeek = (): { start: Date, end: Date } => {
    const previousWeekStartDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() - 7);
    return getWeekStartEndDates(previousWeekStartDate);
};

const nextWeek = (): { start: Date, end: Date } => {
    const nextWeekStartDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() + 7);
    return getWeekStartEndDates(nextWeekStartDate);
};

const prevDay = () => {
    emit('change-date', new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() - 1));
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() - 1);
};

const nextDay = () => {
    emit('change-date', new Date(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1));
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() + 1);
};

const changeView = (newView: string) => {
    viewType.value = newView;

    if (newView === 'weekly') {
        const currentWeekStartDate = getWeekStartEndDates(new Date());
        currentDate.value = currentWeekStartDate.start;
    }

    emit('change-view', newView);
};

function nextDate() {
    switch (viewType.value) {
        case 'monthly':
            nextMonth();
            break;
        case 'weekly':
            nextWeek();
            break;
        default:
            nextDay();
    }
}

function prevDate() {
    switch (viewType.value) {
        case 'monthly':
            prevMonth();
            break;
        case 'weekly':
            prevWeek();
            break;
        default:
            prevDay();
    }
}
</script>

<style scoped>
.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}
</style>
