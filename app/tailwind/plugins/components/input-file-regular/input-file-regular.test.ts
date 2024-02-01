import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {InputFileRegular} from './input-file-regular.component';

describe('InputFileRegular', () => {
    test('Should have no axe violations', async () => {
        const input = InputFileRegular({
            label: 'File input',
            shape: 'rounded',
            id: 'input',
            placeholder: 'Upload files',
        });

        render(input, document.body);

        expect(
            await axe(
                document.body.querySelector('.nui-input-file-regular')!.outerHTML,
            ),
        )?.toHaveNoViolations();
    });
});
