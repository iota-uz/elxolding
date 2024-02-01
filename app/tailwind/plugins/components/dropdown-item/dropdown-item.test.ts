import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { DropdownItem } from './dropdown-item.component';

describe('Dropdown', () => {
    test('Should have no axe violations', async () => {
        const dropdown = DropdownItem({
            href: '#',
            title: 'Title',
            text: 'Dropdown item text',
        });

        render(dropdown, document.body);

        expect(
            await axe(document.body.querySelector('.nui-dropdown-item')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
