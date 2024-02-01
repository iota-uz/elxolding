import {render } from 'lit';
import { describe,expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { PlaceholderPage } from './placeholder-page.component';

describe('PlaceholderPage', () => {
    test('Should have no axe violations', async () => {
        const placeholder = PlaceholderPage({
            title: 'Hello World',
            subtitle: 'Hello World',
        });

        render(placeholder, document.body);

        expect(
            await axe(
        document.body.querySelector('.nui-placeholder-page')!.outerHTML,
            ),
        )?.toHaveNoViolations();
    });
});
