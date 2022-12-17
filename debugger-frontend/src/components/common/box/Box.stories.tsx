import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import Box from "./Box";

export default {
    title: 'common/Box',
    component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = (args) => <Box {...args}><p>My content</p></Box>;

export const MyBox = Template.bind({});
MyBox.args = {
    title: 'My title'
};
MyBox.storyName = 'Box';