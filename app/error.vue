<template>
    <div>
        <TairoError :error="error">
        </TairoError>
    </div>
</template>

<script lang="ts" setup>
import TairoError from './components/tairo/TairoError.vue';

const error = useError();
</script>

<style scoped>

</style>
