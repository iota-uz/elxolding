<template>
    <div>
        <BaseCard class="relative p-6">
            <div class="mb-6">
                <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                >
                    <span>Запросы/день</span>
                </BaseHeading>
            </div>

            <AddonApexcharts v-bind="chartProps"/>
        </BaseCard>
    </div>
</template>

<script lang="ts" setup>
import AddonApexcharts from '~/components/tairo/AddonApexcharts.vue';
import {type Metrics} from '~/types/metrics';

const {metrics} = defineProps<{metrics: Metrics}>();

const chartProps = reactive(useChartProps());

function dayOfYearToDate(d: number) {
    return new Date(new Date().getFullYear(), 0, d);
}

// You can create your own composable function to handle the logic of your chart
function useChartProps() {
    const {primary, info, success} = useTailwindColors();

    const type = 'area';
    const height = 350;

    const options = shallowRef({
        chart: {
            foreColor: '#999',
            stacked: true,
            toolbar: {
                show: false,
            },
            dropShadow: {
                enabled: true,
                enabledSeries: [0],
                top: -2,
                left: 2,
                blur: 5,
                opacity: 0.06,
            },
        },
        colors: [success.value, primary.value, info.value],
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        title: {
            text: '',
            align: 'left',
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
            strokeColor: '#fff',
            strokeWidth: 3,
            strokeOpacity: 1,
            fillOpacity: 1,
            hover: {
                size: 6,
            },
        },
        xaxis: {
            type: 'datetime',
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                offsetX: 0,
                offsetY: -5,
            },
            tooltip: {
                enabled: true,
            },
        },
        grid: {
            show: true,
            padding: {
                left: -5,
                right: 5,
            },
        },
        tooltip: {
            x: {format: 'dd MMM yyyy',},
            y: {},
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
        fill: {
            type: 'solid',
            fillOpacity: 0.7,
        },
    });

    const series = ref([
        {
            name: 'Запросы',
            data: metrics.requests.map(r => ({x: dayOfYearToDate(r.day), y: r.total}))
        }
    ]);

    return {
        type,
        height,
        options,
        series,
    };
}
</script>

<style scoped>

</style>
