import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Breadcrumb } from './breadcrumb.component';

describe('Breadcrumb', () => {
    test('Should have no axe violations', async () => {
        const breadcrumb = Breadcrumb({});

        render(breadcrumb, document.body);

        expect(
            await axe(document.body.querySelector('.nui-breadcrumb')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
