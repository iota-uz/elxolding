import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Placeload } from './placeload.component';

describe('Placeload', () => {
    test('Should have no axe violations', async () => {
        const label = Placeload({});

        render(label, document.body);

        expect(
            await axe(document.body.querySelector('.nui-placeload')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
