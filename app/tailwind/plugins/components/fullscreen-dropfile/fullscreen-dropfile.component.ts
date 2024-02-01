import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { FullscreenDropfileAttrs } from './fullscreen-dropfile.types';

/**
 * Primary UI component for user interaction
 */
export const FullscreenDropfile = ({
    label = 'Drop your files',
    icon,
    isDropping,
    classes,
    ...attrs
}: FullscreenDropfileAttrs) => {
    return html`
    <div
      class=${['nui-fullscreen-dropfile', classes?.wrapper]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    >
      ${isDropping
        ? html`
            <div class="nui-fullscreen-dropfile-outer"></div>
            <div class="nui-fullscreen-dropfile-inner">
              <div class="nui-fullscreen-dropfile-container">
                <div class="nui-fullscreen-dropfile-content">
                  ${icon}
                  <div class="nui-fullscreen-dropfile-label">${label}</div>
                </div>
              </div>
            </div>
          `
        : ''}
    </div>
  `;
};
