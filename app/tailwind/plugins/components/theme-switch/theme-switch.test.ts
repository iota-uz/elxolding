import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {ThemeSwitch} from './theme-switch.component';

describe('ThemeSwitch', () => {
    test('Should have no axe violations', async () => {
        const textarea = ThemeSwitch({});

        render(textarea, document.body);

        expect(
            await axe(document.body.querySelector('.nui-theme-switch')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
