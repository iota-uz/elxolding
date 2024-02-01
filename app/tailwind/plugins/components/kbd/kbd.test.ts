import {html, render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {Kbd} from './kbd.component';

describe('Kbd', () => {
    test('Should render slot', () => {
        Kbd({
            children: html`
                <span>Hello world</span>
            `,
        });

        render(Kbd, document.body);

        expect(document.body.querySelector('.nui-kbd')?.outerHTML)?.toContain(
            'Hello world',
        );
    });

    test('Should have no axe violations', async () => {
        const kbd = Kbd({
            children: html`
                <span>Hello world</span>
            `,
        });

        render(kbd, document.body);

        expect(
            await axe(document.body.querySelector('.nui-kbd')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
