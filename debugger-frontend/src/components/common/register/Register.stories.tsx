import { ComponentMeta, ComponentStory } from "@storybook/react";
import Register from "./Register";

export default {
    title: 'common/Register',
    component: Register,
} as ComponentMeta<typeof Register>;

const Template: ComponentStory<typeof Register> = (args) => <div style={{display:'table'}}>
    <Register {...args} />
</div>;

export const MyRegister = Template.bind({});
MyRegister.args = {
    name: 'Register name',
    value: 8765,
    size: 4,
};
MyRegister.storyName = 'Register';