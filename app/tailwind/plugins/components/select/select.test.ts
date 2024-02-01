import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Select } from './select.component';

describe('Select', () => {
    test('Should have no axe violations', async () => {
        const select = Select({
            label: 'Select',
            shape: 'rounded',
            type: 'text',
            id: 'select',
            placeholder: 'Write something...',
        });

        render(select, document.body);

        expect(
            await axe(document.body.querySelector('.nui-select-wrapper')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
