import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Heading } from './heading.component';

describe('Heading', () => {
    test('Should render slot', () => {
        const heading = Heading({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(heading, document.body);

        expect(document.body.querySelector('.nui-heading')?.outerHTML)?.toContain(
            'Hello world',
        );
    });

    test('Should have no axe violations', async () => {
        const heading = Heading({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(heading, document.body);

        expect(
            await axe(document.body.querySelector('.nui-heading')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
