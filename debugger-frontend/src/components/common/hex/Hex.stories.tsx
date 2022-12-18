import { ComponentMeta, ComponentStory } from "@storybook/react";
import Hex from "./Hex";

export default {
    title: 'common/Hex',
    component: Hex,
} as ComponentMeta<typeof Hex>;

const Template: ComponentStory<typeof Hex> = (args) => <Hex {...args} />;

export const MyHex = Template.bind({});
MyHex.args = {
    value: 123,
    pad: 2,
    withPrefix: false,
    postfix: "",
    showTag: true,
};
MyHex.storyName = 'Hex';