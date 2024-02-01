import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Link } from './link.component';

describe('Link', () => {
    test('Should have no axe violations', async () => {
        const link = Link({
            href: '#',
            children: html`
        Hello World
      `,
        });

        render(link, document.body);

        expect(
            await axe(document.body.querySelector('.nui-label')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
