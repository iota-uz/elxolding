import {render} from 'lit';
import {describe, expect, test} from 'vitest';
import {axe} from 'vitest-axe';

import {FullscreenDropfile} from './fullscreen-dropfile.component';

describe('FullscreenDropfile', () => {
    test('Should have no axe violations', async () => {
        const dropfile = FullscreenDropfile({
            label: 'Fullscreen Dropfile',
        });

        render(dropfile, document.body);

        expect(
            await axe(
                document.body.querySelector('.nui-fullscreen-dropfile')!.outerHTML,
            ),
        )?.toHaveNoViolations();
    });
});
