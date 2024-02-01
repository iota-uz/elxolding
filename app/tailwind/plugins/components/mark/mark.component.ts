import {html} from 'lit';

/**
 * Primary UI component for user interaction
 */
export const Mark = () => {
    return html`
        <div>
            <p class="nui-text nui-text-md text-muted-800 dark:text-muted-100">
                Iam a text that contains
                <span class="nui-mark">some marked words</span>
                inside.
            </p>
        </div>
    `;
};
