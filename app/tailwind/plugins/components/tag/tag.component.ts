import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { TagAttrs } from './tag.types';
import * as variants from './tag.variants';

/**
 * Primary UI component for user interaction
 */
export const Tag = ({
    shadow,
    rounded = 'full',
    children,
    variant = 'solid',
    size = 'md',
    color = 'default',
    classes,
    ...attrs
}: TagAttrs) => {
    return html`
    <span
      class=${[
        'nui-tag',
        variants.size[size],
        variants.variant[variant],
        variants.color[color],
        rounded && variants.rounded[rounded],
        shadow && variant === 'solid' && variants.shadow[shadow],
        classes?.wrapper,
    ]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    >
      ${children}
    </span>
  `;
};
