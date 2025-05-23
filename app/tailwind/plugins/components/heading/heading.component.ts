import { spread } from '@open-wc/lit-helpers';
import { html, unsafeStatic } from 'lit/static-html.js';

import type { HeadingAttrs } from './heading.types';
import * as variants from './heading.variants';

/**
 * Primary UI component for user interaction
 */
export const Heading = ({
    size = 'xl',
    weight = 'semibold',
    lead = 'normal',
    as = 'p',
    classes,
    children,
    ...attrs
}: HeadingAttrs) => {
    return html`
   <${unsafeStatic(as)} class=${[
    'nui-heading',
    size && variants.size[size],
    weight && variants.weight[weight],
    lead && variants.lead[lead],
    classes?.wrapper,
]
    .filter(Boolean)
    .join(' ')}
     ${spread(attrs)}>${children}</${unsafeStatic(as)}>
  `;
};
