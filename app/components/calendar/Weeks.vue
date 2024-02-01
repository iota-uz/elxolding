<template>
    <div>
        <ul class="grid grid-cols-7">
            <li
                class="text-end p-2"
                v-for="(day, index) in weekdays" :key="day"
            >{{ props.weekDates?.length ? `${day}, ${props.weekDates[index]}` : day }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    weekDates?: any[];
}>();

const weekdays = computed(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
});
</script>
