import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Snack } from './snack.component';

describe('Snack', () => {
    test('Should have no axe violations', async () => {
        const snack = Snack({});

        render(snack, document.body);

        expect(
            await axe(document.body.querySelector('.nui-snack')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
