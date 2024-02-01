import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { PlaceloadAttrs } from './placeload.types';

/**
 * Primary UI component for user interaction
 */
export const Placeload = ({ classes, ...attrs }: PlaceloadAttrs) => {
    return html`
    <div
      class=${['nui-placeload animate-nui-placeload', classes?.wrapper]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    ></div>
  `;
};
