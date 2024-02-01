import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Tabs } from './tabs.component';

const data = [
    { label: 'Team', value: 'team' },
    { label: 'Projects', value: 'projects' },
];

describe('Tabs', () => {
    test('Should have no axe violations', async () => {
        const tabs = Tabs({
            tabs: data,
            children: html`
        Hello World
      `,
        });

        render(tabs, document.body);

        expect(
            await axe(document.body.querySelector('.nui-tabs')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
