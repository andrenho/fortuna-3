import {ComponentMeta, ComponentStory} from "@storybook/react";
import {useState} from "react";
import FileChooser from "components/code/FileChooser/FileChooser";

export default {
    title: 'code/FileChooser',
    component: FileChooser,
    argTypes: {
        selectedFile: { control: false }
    }
} as ComponentMeta<typeof FileChooser>;

const Template: ComponentStory<typeof FileChooser> = (args) => {
    const [selectedFile, setSelectedFile] = useState("main.z80");

    return <FileChooser 
        {...args}
        selectedFile={selectedFile}
        onSelectFile={newFile => setSelectedFile(newFile)}
    />;
};

export const MyFileChooser = Template.bind({});
MyFileChooser.args = {
    fileList: ["main.z80", "test.z80", "library.z80"],
};
MyFileChooser.storyName = 'FileChooser';