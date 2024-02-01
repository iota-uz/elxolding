import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { InputNumber } from './input-number.component';

describe('Input', () => {
    test('Should have no axe violations', async () => {
        const input = InputNumber({
            label: 'Input',
            shape: 'rounded',
            type: 'text',
            id: 'input',
            placeholder: 'Write something...',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-input-wrapper')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
