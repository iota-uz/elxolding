<template>
    <div>
        <Header :current-date="selectedDate" @change-date="changeDate"  :view-type="viewType" @change-view="changeView" />
        <Grid :view-type="viewType" :days="getDays(selectedDate)" :events="events" @day-click="selectDay" />
        <EventList v-if="selectedDay && selectedDay.events?.length > 0" :events="selectedDay.events" />
    </div>
</template>

<script lang="ts" setup>

import EventList from './EventList.vue';
import Grid from './Grid.vue';
import Header from './Header.vue';

const selectedDay = ref(null);
const events = ref([
    {
        id: 1,
        name: 'Event 1',
        time: '10:00 AM',
        date: '2021-09-01',
    },
    {
        id: 2,
        name: 'Event 2',
        time: '11:00 AM',
        date: '2024-01-28',
    },
    {
        id: 3,
        name: 'Event 3',
        time: '12:00 PM',
        date: '2024-01-01',
    },
    {
        id: 4,
        name: 'Event 4',
        time: '1:00 PM',
        date: '2024-01-25',
    },
    {
        id: 5,
        name: 'Event 5',
        time: '2:00 PM',
        date: '2024-01-25',
    },
    {
        id: 6,
        name: 'Event 6',
        time: '2:00 PM',
        date: '2024-01-24',
    },
    {
        id: 7,
        name: 'Event 7',
        time: '8:00 PM',
        date: '2024-01-26',
    },
    {
        id: 8,
        name: 'Event 8',
        time: '9:00 PM',
        date: '2024-01-26',
    },
    {
        id: 9,
        name: 'Event 9',
        time: '11:00 PM',
        date: '2024-01-26',
    },
    {
        id: 10,
        name: 'Event 10',
        time: '10:00 PM',
        date: '2024-02-12',
    },
]);
const viewType = ref('weekly');
const selectedDate = ref(new Date());

watch(selectedDate, () => {
    getDays(selectedDate.value);
});

function getDays(date: Date) {
    if(viewType.value === 'monthly') {
        return getDaysInMonth(date);
    } else if (viewType.value === 'weekly') {
        return getDaysInWeek(date);
    } else {
        return getDaysInDay(date);
    }
}

function getDaysInMonth(date: Date) {
    const days = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let startDay = startOfMonth.getDay();
    let endDay = endOfMonth.getDay();

    if(startDay === 0) {
        startDay = 7;
    }
    if (endDay === 0) {
        endDay = 7;
    }
    const startDate = startOfMonth.getDate();
    const endDate = endOfMonth.getDate();

    // Add days from previous month
    for (let i = startDay - 1; i > 0; i--) {
        const cDate = new Date(date.getFullYear(), date.getMonth());
        const pDate = cDate.setDate(cDate.getDate() - i);
        days.push({
            date: new Date(pDate).toISOString().slice(0, 10),
            hidden: true,
        });
    }

    // Add days from current month
    for (let i = startDate; i <= endDate; i++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
        days.push({
            date: currentDate.toISOString().slice(0, 10),
        });
    }

    // Add days from next month
    for (let i = 1; i <= 7 - endDay; i++) {
        const nextDate = new Date(endOfMonth.getTime() + (i) * 24 * 60 * 60 * 1000);
        days.push({
            date: nextDate.toISOString().slice(0, 10),
            hidden: true,
        });
    }

    return days;
}

function getDaysInWeek(date: Date) {
    const days = [];
    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (date.getDay() + 6) % 7);

    for (let i = 1; i <= 7; i++) {
        const endOfWeek = new Date(date);
        endOfWeek.setDate(startOfWeek.getDate() + i);
        days.push({
            date: endOfWeek.toISOString().slice(0, 10),
        });
    }

    return days;
}

function getDaysInDay(date: Date) {
    const days = [];
    const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    days.push({
        date: currentDate.toISOString().slice(0, 10),
    });
    return days;
}

onMounted(() => {
    getDays(selectedDate.value);
});

function changeDate(newDate: Date) {
    selectedDate.value = newDate;
}

function changeView(newView: string) {
    viewType.value = newView;
}

function selectDay(day: any) {
    selectedDay.value = day;
}

onMounted(() => {
    // Fetch events from API
});
</script>
