import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Listbox } from './listbox.component';

describe('Listbox', () => {
    test('Should have no axe violations', async () => {
        const input = Listbox({
            label: 'Listbox',
            shape: 'rounded',
            id: 'listbox',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-listbox')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
