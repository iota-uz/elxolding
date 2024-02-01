<template>
    <div>
        <Weeks :week-dates="getWeekDates()" />
    </div>
    <div class="flex">
        <div>
            <ul class="flex flex-col">
                <li
                    v-for="(hour, index) in hours"
                    :key="hour"
                    class="h-12 border-b border-gray-500"
                    :class="{ 'border-b-0': index === hours.length - 1 }"
                >
                    {{ hour }}:00
                </li>
            </ul>
        </div>
        <div class="grid grid-cols-7 w-full">
            <Day
                v-for="day in props.days"
                :key="day.date"
                :day="day"
                :events="props.events"
                :view-type="props.viewType"
                :hours="hours"
                @click="dayClick(day)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

import Day from '~/components/calendar/Day.vue';
import Weeks from '~/components/calendar/Weeks.vue';

const props = defineProps<{
    days: {
        number: number;
        date: string;
    }[];
    events: any[];
    viewType: string;
}>();

function getWeekDates() {
    const weekDates = [];
    const today = new Date(props.days[0].date);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    for (let i = 1; i <= 7; i++) {
        const day = new Date(monday);
        day.setDate(day.getDate() + i);
        weekDates.push(day.getDate());
    }
    return weekDates;
}

const hours = computed(() => {
    const hoursArray = [];
    for (let i = 0; i <= 24; i++) {
        if(i === 24) {
            hoursArray.push('00');
            break;
        }
        hoursArray.push(String(i).padStart(2, '0'));
    }
    return hoursArray;
});

const emit = defineEmits(['day-click']);

const dayClick = (day: any) => {
    emit('day-click', day);
};

</script>
