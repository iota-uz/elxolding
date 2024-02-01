import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Progress } from './progress.component';

describe('Progress', () => {
    test('Should have no axe violations', async () => {
        const progress = Progress({
            value: 50,
        });

        render(progress, document.body);

        expect(
            await axe(document.body.querySelector('.nui-progress')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
