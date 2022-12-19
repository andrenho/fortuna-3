import { ComponentMeta, ComponentStory } from "@storybook/react";
import ErrorMessage from "./ErrorMessage";

export default {
    title: 'standalone/ErrorMessage',
    component: ErrorMessage,
    argTypes: {
        currentError: { type: "string" },
    }
} as ComponentMeta<typeof ErrorMessage>;

const Template: ComponentStory<typeof ErrorMessage> = (args) => <div style={{display:'table'}}>
    <ErrorMessage {...args} />
</div>;

export const MyErrorMessage = Template.bind({});
MyErrorMessage.args = {
    currentError: "This is a sample error"
};
MyErrorMessage.storyName = 'ErrorMessage';