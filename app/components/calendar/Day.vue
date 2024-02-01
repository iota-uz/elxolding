<template>
    <div
        class="text-end min-h-[100px] cursor-pointer border border-gray-500"
        :class="{
            'bg-emerald-800': isCurrentDay(),
            'bg-gray-800': props.day.hidden,
            'border-t-0 border-b-0' : props.viewType === 'weekly' || props.viewType === 'daily',
        }"
        @click="handleClick"
    >
        <div
            :class="{
                'hidden': props.day.hidden,
            }"
        >
            <span v-if="props.viewType === 'monthly'">{{ getCurrentDay() }}</span>

            <ul
                v-if="hasEvents && props.viewType === 'monthly'"
                class="flex flex-col gap-1 w-full"
            >
                <li
                    v-for="event in eventList()"
                    :key="event.id"
                >
                    <p
                        class="rounded-md text-xs truncate bg-emerald-300"
                        :class="{ 'line-through bg-red-300': isExpiredTask(event) }"
                    >
                        {{ event?.name }} - {{ event?.time }}
                    </p>
                </li>
            </ul>

            <ul v-if="props.viewType !== 'monthly'">
                <li
                    v-for="(hour, index) in props.hours"
                    :key="index"
                    class="h-12 border-b border-gray-500"
                    :class="{ 'border-b-0': index === props.hours.length - 1 }"
                >
                    <p
                        v-for="event in getEventTimeRange(eventList(), hour)"
                        class="rounded-md text-xs truncate bg-emerald-300"
                        :class="{ 'line-through bg-red-300': isExpiredTask(event) }"
                    >
                        {{ event?.name }} - {{ event?.time }}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>

const props = defineProps<{
    day: {
        number: number;
        date: string;
    };
    events: any[];
    hours?: string[];
    viewType: string;
    tasks?: any[];
}>();

const emit = defineEmits(['click']);

const hasEvents = computed(() => {
    return props.events.some((event) => event.date === props.day.date);
});

function eventList() {
    return props.events.filter((event) => event.date === props.day.date);
}

function getEventTimeRange(eventList: any[], hour) {
    const events = eventList.filter(
        (event) => String(event.time.split(':'))[0].padStart(2, '0') === hour
    );
    return events;
}

function isExpiredTask(event: any) {
    const today = new Date();
    const taskDate = new Date(event.date);
    return taskDate <= today;
}

function getCurrentDay() {
    return new Date(props.day.date).getDate();
}

function isCurrentDay() {
    const today = new Date();
    const currentDay = new Date(props.day.date);
    return today.toISOString().slice(0, 10) === currentDay.toISOString().slice(0, 10);
}

const handleClick = () => {
    emit('click', props.day);
};

onMounted(() => {
});
</script>

<style scoped>
</style>
