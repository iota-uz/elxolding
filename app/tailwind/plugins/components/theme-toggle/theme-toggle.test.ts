import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {ThemeToggle} from './theme-toggle.component';

describe('ThemeToggle', () => {
    test('Should have no axe violations', async () => {
        const textarea = ThemeToggle({});

        render(textarea, document.body);

        expect(
            await axe(document.body.querySelector('.nui-theme-toggle')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
