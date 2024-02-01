import {html} from 'lit';

/**
 * Primary UI component for user interaction
 */
export const Mask = () => {
    return html`
        <div class="flex items-end gap-4 p-4">
            <div
                class="nui-mask nui-mask-hex h-12 w-12 bg-muted-100 dark:bg-muted-800"
            ></div>
            <div
                class="nui-mask nui-mask-hexed h-12 w-12 bg-muted-100 dark:bg-muted-800"
            ></div>
            <div
                class="nui-mask nui-mask-blob h-12 w-12 bg-muted-100 dark:bg-muted-800"
            ></div>
            <div
                class="nui-mask nui-mask-deca h-12 w-12 bg-muted-100 dark:bg-muted-800"
            ></div>
            <div
                class="nui-mask nui-mask-diamond h-12 w-12 bg-muted-100 dark:bg-muted-800"
            ></div>
        </div>
    `;
};
