import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { DropdownDividerAttrs } from './dropdown-divider.types';

/**
 * Primary UI component for user interaction
 */
export const DropdownDivider = ({
    classes,
    ...attrs
}: DropdownDividerAttrs) => {
    return html`
    <div
      class=${['nui-dropdown-divider', classes?.wrapper]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    ></div>
  `;
};
