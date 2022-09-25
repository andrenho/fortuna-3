import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import FlatData from "./FlatData";

export default {
    title: 'common/FlatData',
    component: FlatData,
    argTypes: {
        bytes: { control: false },
        topRightElement: { control: false },
    }
} as ComponentMeta<typeof FlatData>;

const array = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(array);

const Template: ComponentStory<typeof FlatData> = (args) => <FlatData {...args} bytes={array}>
    <p style={{backgroundColor: "yellow"}}>[ Additional content ]</p>
</FlatData>;

export const MyFlatData = Template.bind({});
MyFlatData.args = {
    title: 'My title',
    currentPage: 0,
    totalPages: 16,
    rows: 16,
    highlightOffset: { '0': 'lime' }
};
MyFlatData.storyName = 'FlatData';