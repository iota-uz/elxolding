import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { InputFile } from './input-file.component';

describe('InputFile', () => {
    test('Should have no axe violations', async () => {
        const input = InputFile({});

        render(input, document.body);

        expect(
            await axe(document.body.querySelector('.nui-input-file')!.outerHTML),
        )?.toHaveNoViolations();
    });
});
