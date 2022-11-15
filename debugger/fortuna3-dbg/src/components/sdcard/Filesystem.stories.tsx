import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import Filesystem from "./Filesystem";

export default {
    title: 'standalone/Filesystem',
    component: Filesystem,
    argTypes: {
        currentPageBytes: { control: false },
    }
} as ComponentMeta<typeof Filesystem>;

const Template: ComponentStory<typeof Filesystem> = (args) => <Filesystem {...args} />;

const array = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(array);

export const MyFilesystem = Template.bind({});
MyFilesystem.args = {
};
MyFilesystem.storyName = 'Filesystem';