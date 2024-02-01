import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { LinkAttrs } from './link.types';

/**
 * Primary UI component for user interaction
 */
export const Link = ({ href, classes, children, ...attrs }: LinkAttrs) => {
    return html`
    <a
      href="${href}"
      class=${['nui-link', classes?.wrapper].filter(Boolean).join(' ')}
      ${spread(attrs)}
    >
      ${children}
    </a>
  `;
};
