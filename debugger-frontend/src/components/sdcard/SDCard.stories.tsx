import { ComponentMeta, ComponentStory } from "@storybook/react";
import SDCard from "./SDCard";

export default {
    title: 'sdcard/SDCard',
    component: SDCard,
    argTypes: {
        currentPageBytes: { control: false },
    }
} as ComponentMeta<typeof SDCard>;

const Template: ComponentStory<typeof SDCard> = (args) => <SDCard {...args}>
    <p style={{backgroundColor: 'yellow'}}>Additional component</p>
</SDCard>;

const array = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(array);

export const MySDCard = Template.bind({});
MySDCard.args = {
    currentPage: 0,
    sdCardSizeInMB: 1,
    currentPageBytes: array,
    getCompressedImageBytes: () => new Uint8Array(1),
};
MySDCard.storyName = 'SDCard';