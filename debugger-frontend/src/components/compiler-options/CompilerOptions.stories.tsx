import {ComponentMeta, ComponentStory} from "@storybook/react";
import CompilerOptions from "./CompilerOptions";

export default {
    title: 'standalone/CompilerOptions',
    component: CompilerOptions,
} as ComponentMeta<typeof CompilerOptions>;

const Template: ComponentStory<typeof CompilerOptions> = (args) => <div style={{display:'table'}}>
    <CompilerOptions {...args} />
</div>;

export const MyCompilerOptions = Template.bind({});
MyCompilerOptions.args = {
    options: { collapseMacros: false },
};
MyCompilerOptions.storyName = 'CompilerOptions';