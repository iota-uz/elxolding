import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { ListAttrs } from './list.types';

/**
 * Primary UI component for user interaction
 */
export const List = ({
    ordered,
    hasMedia,
    classes,
    children,
    ...attrs
}: ListAttrs) => {
    return html`
    <div
      class=${[
        'nui-list',
        ordered && !hasMedia && 'nui-list-base nui-list-ol',
        !ordered && !hasMedia && 'nui-list-base nui-list-ul',
        hasMedia && 'nui-list-media',
        classes?.wrapper,
    ]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    >
      ${children}
    </div>
  `;
};
