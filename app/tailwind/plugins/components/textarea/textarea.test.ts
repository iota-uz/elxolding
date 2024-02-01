import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {Textarea} from './textarea.component';

describe('Textarea', () => {
    test('Should have no axe violations', async () => {
        const textarea = Textarea({
            label: 'Textarea',
            shape: 'rounded',
            id: 'textarea',
            placeholder: 'Write something...',
        });

        render(textarea, document.body);

        expect(
            await axe(
                document.body.querySelector('.nui-textarea-wrapper')!.outerHTML,
            ),
        )?.toHaveNoViolations();
    });
});
