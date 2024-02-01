import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {Toast} from './toast.component';

describe('Toast', () => {
    test('Should have no axe violations', async () => {
        const label = Toast({
            title: 'Hello World',
            text: 'Action was a success!',
        });

        render(label, document.body);

        expect(
            await axe(document.body.querySelector('.nui-toast')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
