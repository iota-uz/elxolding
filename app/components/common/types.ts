import {RouteLocationRaw} from 'vue-router';

export type Ordering = { [index: string]: 1 | -1 };

export interface Column<T = any> {
    label: string; // label displayed in column
    name: string; // required column for :key
    width?: number; // column width between 0 and 100
    field?: (item: T) => any; // if field function is provided it will use it to fill column content. You can also pass raw html here
    subtitle?: (item: T) => any; // same as field, but is displayed below the field content
    link?: (item: T) => RouteLocationRaw; // if provided content becomes a hyperlink
    click?: (item: T) => any; // if provided this function will be called when cell is clicked
    money?: boolean; // if true it will format the number as money using Money.vue
    phone?: boolean; // if true it will format the string as phone number using Phone.vue
    dateFormat?: string; // example: "calendar" or "MMM DD". More info about formatting in moment docs
    duration?: boolean;
    sortable?: boolean; // if true the column will become sortable
    classes?: string; // css classes to apply
    enums?: { [index: string]: string }; // if provided it will use the enum value to display the label
    decimalPoints?: number; // if provided it will round the number to the specified decimal points
    mask?: string; // if provided it will format the number using mask, ex.: +1 (###) ###-####
    style?: {
        overwrite?: boolean; // if true will overwrite any default styles
        value: object; // example: {width: "100px"}
    };
}
