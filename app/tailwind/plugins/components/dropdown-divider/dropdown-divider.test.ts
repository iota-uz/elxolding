import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { DropdownDivider } from './dropdown-divider.component';

describe('DropdownDivider', () => {
    test('Should have no axe violations', async () => {
        const divider = DropdownDivider({});

        render(divider, document.body);

        expect(
            await axe(
        document.body.querySelector('.nui-dropdown-divider')!.outerHTML,
            ),
        )?.toHaveNoViolations();
    });
});
