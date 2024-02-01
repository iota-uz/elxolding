import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Text } from './text.component';

describe('Text', () => {
    test('Should render slot', () => {
        const text = Text({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(text, document.body);

        expect(document.body.querySelector('.nui-text')?.outerHTML)?.toContain(
            'Hello world',
        );
    });

    test('Should have no axe violations', async () => {
        const text = Text({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(text, document.body);

        expect(
            await axe(document.body.querySelector('.nui-text')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
