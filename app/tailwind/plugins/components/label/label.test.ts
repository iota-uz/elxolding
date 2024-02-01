import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Label } from './label.component';

describe('Label', () => {
    test('Should have no axe violations', async () => {
        const label = Label({
            children: html`
        Hello World
      `,
        });

        render(label, document.body);

        expect(
            await axe(document.body.querySelector('.nui-label')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
