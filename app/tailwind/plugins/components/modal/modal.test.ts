import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Modal } from './modal.component';

describe('Modal', () => {
    test('Should have no axe violations', async () => {
        const modal = Modal({
            open: true,
            children: html`
        Hello World
      `,
        });

        render(modal, document.body);

        expect(
            await axe(document.body.querySelector('.nui-modal')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
