import {ComponentMeta, ComponentStory} from "@storybook/react";
import Stack from "components/memory/Stack/Stack";

export default {
    title: 'ram/Stack',
    component: Stack,
    argTypes: {
        stack: { control: false },
    }
} as ComponentMeta<typeof Stack>;

const array = new Uint8Array(16);
window.crypto.getRandomValues(array);

const Template: ComponentStory<typeof Stack> = (args) => <Stack {...args} />;

export const MyStack = Template.bind({});
MyStack.args = {
    stack: array
};
MyStack.storyName = 'Stack';