import { html,render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { Tag } from './tag.component';

describe('Tag', () => {
    test('Should have no axe violations', async () => {
        const input = Tag({
            children: html`
        Hello World
      `,
        });

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-radio')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
