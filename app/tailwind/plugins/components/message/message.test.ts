import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Message } from './message.component';

describe('Message', () => {
    test('Should have no axe violations', async () => {
        const message = Message({
            children: html`
        Hello World
      `,
        });

        render(message, document.body);

        expect(
            await axe(document.body.querySelector('.nui-message')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
