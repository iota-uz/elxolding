import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { ButtonGroupAttrs } from './button-group.types';

/**
 * Primary UI component for user interaction
 */
export const ButtonGroup = ({
    classes,
    children,
    ...attrs
}: ButtonGroupAttrs) => {
    return html`
    <div
      class=${['nui-button-group', classes?.wrapper].filter(Boolean).join(' ')}
      ${spread(attrs)}
    >
      ${children}
    </div>
  `;
};
