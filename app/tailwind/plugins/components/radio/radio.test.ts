import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Radio } from './radio.component';

describe('Radio', () => {
    test('Should have no axe violations', async () => {
        const input = Radio({
            label: 'Radio',
            id: 'radio',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-radio')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
