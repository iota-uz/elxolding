<template>
    <div>
        <Weeks />
    </div>
    <div class="grid grid-cols-7">
        <Day
            v-for="day in props.days"
            :key="day.date"
            :day="day"
            :events="props.events"
            :view-type="props.viewType"
            @click="dayClick(day)"
        />
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

const emit = defineEmits(['day-click']);

const dayClick = (day: any) => {
    emit('day-click', day);
};
</script>
