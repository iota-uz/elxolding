import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Autocomplete } from './autocomplete.component';

describe('Autocomplete', () => {
    test('Should have no axe violations', async () => {
        const input = Autocomplete({
            label: 'Autocomplete',
            shape: 'rounded',
            id: 'autocomplete',
            placeholder: 'Search...',
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-autocomplete')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
