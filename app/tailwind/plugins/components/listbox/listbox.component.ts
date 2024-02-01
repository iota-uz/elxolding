import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { ListboxAttrs } from './listbox.types';
import * as variants from './listbox.variants';

/**
 * Primary UI component for user interaction
 */
export const Listbox = ({
    id,
    value,
    items,
    rounded = 'sm',
    size = 'md',
    contrast = 'default',
    label,
    labelFloat,
    loading,
    error,
    classes,
    icon,
    ...attrs
}: ListboxAttrs) => {
    return html`
    <div
      class=${[
        'nui-listbox',
        contrast && variants.contrast[contrast],
        size && variants.size[size],
        rounded && variants.rounded[rounded],
        error && !loading && 'nui-listbox-error',
        loading && 'nui-listbox-loading',
        labelFloat && 'nui-listbox-label-float',
        icon && 'nui-has-icon',
        classes?.wrapper,
    ]
        .filter(Boolean)
        .join(' ')}
    >
      ${label && !labelFloat
        ? html`
            <label
              class="${['nui-listbox-label', classes?.label]
        .filter(Boolean)
        .join(' ')}"
              for="${id}"
            >
              ${label}
            </label>
          `
        : ''}
      <div class="nui-listbox-outer">
        <button type="button" class="nui-listbox-button" ${spread(attrs)}>
          ${value}
        </button>
        ${label && labelFloat
        ? html`
              <label
                class="${['nui-label-float', classes?.label]
        .filter(Boolean)
        .join(' ')}"
                for="${id}"
              >
                ${label}
              </label>
            `
        : ''}
        ${icon &&
        html`
          <div
            class="${['nui-listbox-icon nui-icon', classes?.icon]
        .filter(Boolean)
        .join(' ')}"
          >
            ${icon}
          </div>
        `}
        <div class="nui-listbox-chevron nui-chevron">
          <svg
            class="nui-listbox-chevron-inner h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        ${loading &&
        html`
          <div class="nui-listbox-placeload">
            <span class="nui-placeload animate-nui-placeload"></span>
          </div>
        `}
        ${error &&
        typeof error === 'string' &&
        html`
          <span
            class="${['nui-listbox-error-text', classes?.error]
        .filter(Boolean)
        .join(' ')}"
          >
            ${error}
          </span>
        `}
        <div class="nui-listbox-options">${items}</div>
      </div>
    </div>
  `;
};
