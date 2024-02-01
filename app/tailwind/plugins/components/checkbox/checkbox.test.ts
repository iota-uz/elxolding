import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Checkbox } from './checkbox.component';

describe('Checkbox', () => {
    test('Should have no axe violations', async () => {
        const input = Checkbox({
            label: 'Checkbox',
            shape: 'rounded',
            id: 'checkbox',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-checkbox')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
