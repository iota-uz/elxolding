<template>
    <div ref="target">
        <BasePlaceload
            v-if="!isLoaded && !targetIsVisible"
            :style="{ height: `${height - 32}px` }"
            class="m-4 w-[calc(100%-32px)]"
        />
        <ClientOnly>
            <LazyApexCharts v-if="targetIsVisible" v-show="isLoaded" v-bind="props"/>
            <BasePlaceload
                v-else
                :style="{ height: `${height - 32}px` }"
                class="m-4 w-[calc(100%-32px)]"
            />
        </ClientOnly>
    </div>
</template>

<script lang="ts" setup>
import '~/assets/css/apexcharts.css';

const props = defineProps<{
    type: string
    height: number
    width?: number
    series: any[]
    /**
     * ApexCharts options - Without `series`, `chart.type` / `chart.height` / `chart.width`  properties
     * @see https://apexcharts.com/docs/options/
     */
    options?: Record<string, any>
}>();
const {LazyApexCharts, isLoaded} = useLazyApexCharts();
const target = ref(null);
const targetIsVisible = ref(false);

// When the target is visible on viewport, load the chart
const {stop} = useIntersectionObserver(target, ([{isIntersecting}]) => {
    if (isIntersecting) {
        targetIsVisible.value = isIntersecting;
        stop();
    }
});
</script>
