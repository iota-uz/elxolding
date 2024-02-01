import type {Meta, StoryObj} from '@storybook/web-components';

import {Mask} from './mask.component';
import type {MaskAttrs} from './mask.types';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
    title: 'Shuriken UI/Utility/Mask',
    render: (args: MaskAttrs) => Mask(args),
    argTypes: {},
} satisfies Meta<MaskAttrs>;

export default meta;
type Story = StoryObj<MaskAttrs>

// first export is the Primary story

// #region Main
export const Main: Story = {
    name: 'Main example',
    args: {},
};
// #endregion
