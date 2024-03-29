import {ComponentMeta, ComponentStory} from "@storybook/react";
import Flag from "./Flag";

export default {
    title: 'common/Flag',
    component: Flag,
} as ComponentMeta<typeof Flag>;

const Template: ComponentStory<typeof Flag> = (args) => <Flag {...args} />;

export const MyFlag = Template.bind({});
MyFlag.args = {
    name: 'Flag name',
    value: false,
};
MyFlag.storyName = 'Flag';