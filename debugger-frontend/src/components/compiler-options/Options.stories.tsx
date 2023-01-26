import {ComponentMeta, ComponentStory} from "@storybook/react";
import Options from "components/compiler-options/Options";

export default {
    title: 'standalone/Options',
    component: Options,
} as ComponentMeta<typeof Options>;

const Template: ComponentStory<typeof Options> = (args) => <div style={{display:'table'}}>
    <Options {...args} />
</div>;

export const MyOptions = Template.bind({});
MyOptions.args = {
    remoteOptions: { collapseMacros: false },
    localOptions: { showBytes: true },
};
MyOptions.storyName = 'Options';