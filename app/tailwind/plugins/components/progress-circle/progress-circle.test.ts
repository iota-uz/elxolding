import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { ProgressCircle } from './progress-circle.component';

describe('ProgressCircle', () => {
    test('Should have no axe violations', async () => {
        const progress = ProgressCircle({
            value: 50,
        });

        render(progress, document.body);

        expect(
            await axe(document.body.querySelector('svg.block')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
