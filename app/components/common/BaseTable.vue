<template>
    <div class="overflow-x-auto relative">
        <TairoTable
            class="dark:bg-muted-800 bg-muted-50 whitespace-nowrap"
            shape="rounded"
        >
            <template #header>
                <TairoTableHeading
                    v-if="props.bulkActions"
                    class="p-4"
                >
                    <BaseCheckbox
                        :indeterminate="isIntermediate"
                        :model-value="isEverythingSelected"
                        type="checkbox"
                        @update:model-value="selectAll($event)"
                    />
                </TairoTableHeading>
                <TairoTableHeading
                    v-for="column in columns"
                    :key="column.name"
                    class="py-2.5 px-4"
                    scope="col"
                >
                    <a
                        v-if="column.sortable"
                        :class="{'cursor-pointer select-none': column.sortable}"
                        href="#"
                        @click.prevent="setOrdering(column.name)"
                    >
                        {{ column.label }}
                    </a>
                    <span v-else>{{ column.label }}</span>
                    <span
                        v-if="props.sortBy[column.name]"
                        class="ml-1"
                    >
                        <Icon
                            v-if="props.sortBy[column.name] === 1"
                            name="ph:caret-down"
                        />
                        <Icon
                            v-else-if="props.sortBy[column.name] === -1"
                            name="ph:caret-up"
                        />
                    </span>
                </TairoTableHeading>
            </template>
            <template v-if="loading">
                <TairoTableRow
                    v-for="n in props.shimmerSlots"
                    :key="n"
                >
                    <TairoTableCell
                        v-for="column in props.columns"
                        :key="column.name"
                        class="p-4"
                    >
                        <BasePlaceload class="h-4 rounded-md w-full" />
                    </TairoTableCell>
                </TairoTableRow>
            </template>
            <TairoTableRow
                v-else-if="!props.data.length"
            >
                <TairoTableCell
                    :colspan="columnsCount"
                    class="text-center py-4"
                >
                    Пока ничего
                </TairoTableCell>
            </TairoTableRow>
            <template v-else>
                <TairoTableRow
                    v-for="item in props.data"
                    :key="item.id"
                >
                    <TairoTableCell
                        v-if="bulkActions"
                        class="p-4"
                    >
                        <BaseCheckbox
                            :model-value="isRowSelected(item)"
                            @update:model-value="setSelected(item, $event)"
                        />
                    </TairoTableCell>
                    <TairoTableCell
                        v-for="column in props.columns"
                        :key="column.name"
                        :class="columnClass(column)"
                        :style="columnStyle(column)"
                        class="p-4"
                        @click="
                            column.link
                                ? $router.push(column.link(item))
                                : column.click
                                    ? column.click(item)
                                    : null
                        "
                    >
                        <span
                            v-if="column.dateFormat"
                            class="text-muted-500"
                        >
                            {{ formatDate(item[column.name], column.dateFormat) }}
                        </span>
                        <template v-else-if="column.money">
                            <Money
                                :value="getValue(item, column)"
                                class="text-muted-500"
                            />
                        </template>
                        <template v-else-if="column.phone">
                            <Phone
                                :value="getValue(item, column)"
                                class="text-muted-500"
                                hyperlink
                            />
                        </template>
                        <span
                            v-else
                            class="text-muted-500"
                            v-html="getValue(item, column)"
                        />
                        <div
                            v-if="column.subtitle"
                            class="text-muted-400 dark:text-muted-600 text-sm"
                            v-html="column.subtitle(item)"
                        />
                    </TairoTableCell>
                    <slot
                        :item="item"
                        name="buttons"
                    />
                </TairoTableRow>
            </template>
        </TairoTable>
    </div>
</template>

<script lang="ts" setup>
import moment from 'moment';
import {conformToMask} from 'text-mask-core';

import Money from '~/components/common/Money.vue';
import Phone from '~/components/common/Phone.vue';
import {type Column} from '~/components/common/types';
import TairoTable from '~/components/tairo/TairoTable.vue';
import TairoTableCell from '~/components/tairo/TairoTableCell.vue';
import TairoTableHeading from '~/components/tairo/TairoTableHeading.vue';
import TairoTableRow from '~/components/tairo/TairoTableRow.vue';

interface Props {
    columns: Column[]
    data: any[]
    sortBy: Record<string, number>
    actions?: boolean
    loading?: boolean
    bulkActions?: boolean
    selected?: any[]
    selector?: (t: any) => any
    shimmerSlots?: number
}

const props = withDefaults(defineProps<Props>(), {shimmerSlots: 10, selector: (t: any) => t.id, selected: () => []});
const emit = defineEmits(['update:selected', 'update:sortBy']);

const columnsCount = computed(() => {
    let columnsCount = props.columns.length;
    if (props.actions) {
        columnsCount++;
    }
    return columnsCount;
});

const isEverythingSelected = computed(() => {
    const selectedCount = new Set(props.selected).size;
    const allCount = new Set(props.data.map(props.selector)).size;
    return selectedCount === allCount;
});

const isIntermediate = computed(() => props.selected.length > 0 && !isEverythingSelected.value);

function isRowSelected(item: any) {
    const id = props.selector(item);
    if (!props.selected)
        throw new Error('props.selected was not provided');
    return props.selected.includes(id);
}

function setSelected(item: any, val: boolean) {
    const id = props.selector(item);
    if (!props.selected) {
        throw new Error('props.selected was not provided');
    }
    if (val) {
        emit('update:selected', Array.from(new Set([...props.selected, id])));
    } else {
        emit('update:selected', props.selected.filter((s) => s !== id));
    }
}

function setOrdering(column: string) {
    const order = props.sortBy[column] || 1;
    emit('update:sortBy', {[column]: order === 1 ? -1 : 1});
}

function getValue(item: any, column: Column<any>) {
    if (column.field) {
        return column.enums ? column.enums[column.field(item)] : column.field(item);
    }
    if (column.enums) {
        return column.enums[item[column.name]];
    }
    if (column.mask) {
        return conformToMask(item[column.name], stringToMask(column.mask), {guide: false}).conformedValue;
    }
    if (column.decimalPoints !== undefined) {
        return (item[column.name] || 0).toFixed(column.decimalPoints);
    }
    return item[column.name];
}

function formatDate(date: any, format: string): string {
    if (!date)
        return '-';

    if (format === 'calendar') {
        return moment.utc(date).locale('ru').local().calendar();
    }
    return moment.utc(date).locale('ru').local().format(format);
}

function columnClass(column: Column) {
    return [{'cursor-pointer': column.link || column.click}, column.classes];
}

function columnStyle(column: Column): object | object[] {
    const defaultStyle: Record<string, string> = {
        'white-space': 'nowrap',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
        'max-width': '150px'
    };
    if (column.width) {
        defaultStyle['width'] = `${column.width}%`;
        return defaultStyle;
    }
    if (!column.style)
        return defaultStyle;

    if (column.style.overwrite) {
        return column.style.value;
    }
    return [defaultStyle, column.style.value];
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function selectAll(val: boolean) {
    if (val) {
        let selected = new Set(props.selected);
        for (let item of props.data) {
            selected.add((props.selector as any)(item));
        }
        emit('update:selected', Array.from(selected));
    } else {
        emit('update:selected', []);
    }
}
</script>

<style scoped>
</style>
