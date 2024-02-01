import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {SwitchBall} from './switch-ball.component';

describe('SwitchBall', () => {
    test('Should have no axe violations', async () => {
        const switchBall = SwitchBall({
            label: 'SwitchBall',
            id: 'switch-ball',
        });

        render(switchBall, document.body);

        expect(
            await axe(document.body.querySelector('.nui-switch-ball')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
