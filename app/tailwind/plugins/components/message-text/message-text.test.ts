import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { MessageText } from './message-text.component';

describe('MessageText', () => {
    test('Should have no axe violations', async () => {
        const label = MessageText({
            title: 'Hello World',
        });

        render(label, document.body);

        expect(
            await axe(document.body.querySelector('.nui-message-text')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
