<template>
    <div>
        <template v-if="props.viewType === 'monthly'">
            <Monthly :days="props.days" :events="props.events" @day-click="dayClick" :view-type="props.viewType" />
        </template>
        <template v-else-if="viewType === 'weekly'">
            <Weekly :days="props.days" :events="props.events" @day-click="dayClick" :view-type="props.viewType" />
        </template>
        <template v-else>
        </template>
    </div>
</template>

<script lang="ts" setup>
import Monthly from '~/components/calendar/Monthly.vue';
import Weekly from '~/components/calendar/Weekly.vue';

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

<style scoped>
</style>
