import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Pagination } from './pagination.component';

describe('Pagination', () => {
    test('Should have no axe violations', async () => {
        const input = Pagination({
            shape: 'rounded',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-pagination')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
