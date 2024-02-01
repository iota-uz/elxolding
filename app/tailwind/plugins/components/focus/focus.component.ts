import {html} from 'lit';

/**
 * Primary UI component for user interaction
 */
export const Focus = () => {
    return html`
        <div
            tabindex="0"
            role="button"
            class="nui-focus h-12 flex items-center p-6 rounded-md bg-muted-100 dark:bg-muted-800"
        >
            <span>Iam a focus ready block. Focus me!</span>
        </div>
    `;
};
