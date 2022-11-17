import { ComponentMeta, ComponentStory, storiesOf } from "@storybook/react";
import { useState } from "react";
import Filesystem, { FileType } from "./Filesystem";

export default {
    title: 'standalone/Filesystem',
    component: Filesystem,
    argTypes: {
        currentPageBytes: { control: false },
    }
} as ComponentMeta<typeof Filesystem>;

const Template: ComponentStory<typeof Filesystem> = (args) => {

    const [selectedFile, setSelectedFile] = useState<string | undefined>();
    const [page, setPage] = useState(1);

    return <Filesystem
        {...args}
        selectedFile={selectedFile}
        onFileSelect={(file) => setSelectedFile(file)}
        selectedPage={page}
        onPageChange={(n) => setPage(n)}
    />;
}

export const MyFilesystem = Template.bind({});
MyFilesystem.args = {
    fileList: [
        { filename: "..", fileType: FileType.Directory },
        { filename: "BOOT.BIN", fileType: FileType.File },
        { filename: "KERNEL", fileType: FileType.Directory },
    ],
};
MyFilesystem.storyName = 'Filesystem';