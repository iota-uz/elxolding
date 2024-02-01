import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {SwitchThin} from './switch-thin.component';

describe('SwitchThin', () => {
    test('Should have no axe violations', async () => {
        const switchThin = SwitchThin({
            label: 'SwitchThin',
            id: 'switch-thin',
        });

        render(switchThin, document.body);

        expect(
            await axe(document.body.querySelector('.nui-switch-thin')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
