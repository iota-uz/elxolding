<template>
    <ul v-if="events.length > 0">
        <li v-for="event in events" :key="event.id">
            {{ event.name }} - {{ event.time }}
        </li>
    </ul>
</template>

<script lang="ts" setup>

defineProps<{
    events: any[];
}>();
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
li {
    padding: 5px;
    border-bottom: 1px solid #ddd;
}
</style>
