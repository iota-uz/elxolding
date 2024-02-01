<template>
    <ul v-if="props.tasks && props.tasks.length > 0">
        <li v-for="task in props.tasks" :key="task.id" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <span v-if="task.dueDate" class="task-due-date">Due: {{ task.dueDate }}</span>
        </li>
    </ul>
    <li v-else-if="props.task">
        <span class="task-name">{{ props.task?.name }}</span>
        <span v-if="props.task?.dueDate" class="task-due-date">Due: {{ props.task?.dueDate }}</span>
    </li>
</template>

<script lang="ts" setup>

const props = defineProps<{
    tasks: any[];
    task: any;
}>();
</script>

<style scoped>
.task-item {
    list-style: none;
    padding: 5px 10px;
    border-bottom: 1px solid #ddd;
}
.task-name {
    font-weight: bold;
}
.task-due-date {
    color: gray;
    font-size: smaller;
}
</style>
