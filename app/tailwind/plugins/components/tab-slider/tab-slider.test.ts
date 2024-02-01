import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { TabSlider } from './tab-slider.component';

const data = [
    { label: 'Team', value: 'team' },
    { label: 'Projects', value: 'projects' },
];

describe('TabSlider', () => {
    test('Should have no axe violations', async () => {
        const tabs = TabSlider({
            tabs: data,
            children: html`
        Hello World
      `,
        });

        render(tabs, document.body);

        expect(
            await axe(document.body.querySelector('.nui-tab-slider')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
