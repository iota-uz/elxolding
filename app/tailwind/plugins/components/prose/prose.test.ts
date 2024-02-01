import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Prose } from './prose.component';

describe('Prose', () => {
    test('Should have no axe violations', async () => {
        const prose = Prose({
            children: html`
        Hello World
      `,
        });

        render(prose, document.body);

        expect(
            await axe(document.body.querySelector('.nui-prose')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
