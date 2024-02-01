import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { List } from './list.component';

describe('List', () => {
    test('Should render slot', () => {
        const list = List({
            children: html`
        <li>Hello world</li>
      `,
        });

        render(list, document.body);

        expect(document.body.querySelector('.nui-list')?.outerHTML)?.toContain(
            'Hello world',
        );
    });

    test('Should have no axe violations', async () => {
        const list = List({
            children: html`
        <li>Hello world</li>
      `,
        });

        render(list, document.body);

        expect(
            await axe(document.body.querySelector('.nui-list')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
