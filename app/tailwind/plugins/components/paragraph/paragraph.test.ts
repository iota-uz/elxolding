import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Paragraph } from './paragraph.component';

describe('Paragraph', () => {
    test('Should render slot', () => {
        const paragraph = Paragraph({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(paragraph, document.body);

        expect(document.body.querySelector('.nui-paragraph')?.outerHTML)?.toContain(
            'Hello world',
        );
    });

    test('Should have no axe violations', async () => {
        const paragraph = Paragraph({
            children: html`
        <span>Hello world</span>
      `,
        });

        render(paragraph, document.body);

        expect(
            await axe(document.body.querySelector('.nui-paragraph')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
