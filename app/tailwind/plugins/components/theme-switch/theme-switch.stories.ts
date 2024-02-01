import type {Meta, StoryObj} from '@storybook/web-components';

import {ThemeSwitch} from './theme-switch.component';
import type {ThemeSwitchAttrs} from './theme-switch.types';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
    title: 'Shuriken UI/Base/Theme Switch',
    // tags: ['autodocs'],
    render: (args) => ThemeSwitch(args),
    argTypes: {
        inverted: {
            name: 'Inverted',
            control: {type: 'boolean'},
            defaultValue: false,
        },
    },
} satisfies Meta<ThemeSwitchAttrs>;

export default meta;
type Story = StoryObj<ThemeSwitchAttrs>

// first export is the Primary story

// #region Main
export const Main: Story = {
    name: 'Main example',
    args: {},
};
// #endregion

// #region Inverted:false
export const InvertedFalse: Story = {
    name: 'Inverted: false',
    args: {},
};
// #endregion

// #region Inverted:true
export const InvertedTrue: Story = {
    name: 'Inverted: true',
    args: {
        inverted: true,
    },
};
// #endregion
