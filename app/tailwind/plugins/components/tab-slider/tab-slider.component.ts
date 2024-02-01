import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';

import type { TabSliderAttrs } from './tab-slider.types';
import * as variants from './tab-slider.variants';

/**
 * Primary UI component for user interaction
 */
export const TabSlider = ({
    tabs,
    justify = 'start',
    rounded = 'md',
    size = 'md',
    classes,
    children,
    ...attrs
}: TabSliderAttrs) => {
    function tabsLength() {
        return Math.min(3, Math.max(2, tabs.length));
    }
    return html`
    <div
      class=${[
        'nui-tab-slider',
        justify && variants.justify[justify],
        rounded && variants.rounded[rounded],
        size && variants.size[size],
        classes?.wrapper,
        tabsLength() === 2 ? 'nui-tabs-two-slots' : 'nui-tabs-three-slots',
    ]
        .filter(Boolean)
        .join(' ')}
      ${spread(attrs)}
    >
      <div class="nui-tab-slider-inner">
        <div class="nui-tab-slider-track">
          ${tabs?.map(
        (tab, index) => html`
              <button
                type="button"
                class=${['nui-tab-slider-item', index === 0 && 'nui-active']
        .filter(Boolean)
        .join(' ')}
                tabindex="0"
              >
                <!--Icon v-if="tab.icon" :name="tab.icon" class="me-1 block h-5 w-5" /-->
                <span class=${['nui-tabs'].filter(Boolean).join(' ')}>
                  ${tab.label}
                </span>
              </button>
            `,
    )}
          <div class="nui-tab-slider-naver"></div>
        </div>
      </div>
      <div class="nui-tab-content">${children}</div>
    </div>
  `;
};
