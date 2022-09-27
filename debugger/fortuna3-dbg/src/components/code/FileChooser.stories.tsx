import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import { useState } from "react";
import FileChooser from "./FileChooser";

export default {
    title: 'code/FileChooser',
    component: FileChooser,
} as ComponentMeta<typeof FileChooser>;

const Template: ComponentStory<typeof FileChooser> = (args) => {
    const [selectedFile, setSelectedFile] = useState("main.z80");

    return <FileChooser 
        {...args}
        selectedFile={selectedFile}
        onSelectFile={n => setSelectedFile(selectedFile)}
    />;
};

export const MyFileChooser = Template.bind({});
MyFileChooser.args = {
    fileList: ["main.z80", "test.z80", "library.z80"],
};
MyFileChooser.storyName = 'FileChooser';