import {html, render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {ButtonGroup} from './button-group.component';

describe('ButtonGroup', () => {
    test('Should render slot', () => {
        const buttonGroup = ButtonGroup({
            children: html`
                <span>Hello world</span>
            `,
        });

        render(buttonGroup, document.body);

        expect(
            document.body.querySelector('.nui-button-group')?.outerHTML,
        )?.toContain('Hello world');
    });

    test('Should have no axe violations', async () => {
        const buttonGroup = ButtonGroup({
            children: html`
                <span>Hello world</span>
            `,
        });

        render(buttonGroup, document.body);

        expect(
            await axe(document.body.querySelector('.nui-button-group')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
