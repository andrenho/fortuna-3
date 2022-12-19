import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import Filesystem from "./Filesystem";
import {FileType} from "api/fortuna3-emulator";

export default {
    title: 'sdcard/Filesystem',
    component: Filesystem,
    argTypes: {
        currentPageBytes: { control: false },
    }
} as ComponentMeta<typeof Filesystem>;

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum, tortor quis fringilla hendrerit, nisi elit convallis tortor, pulvinar auctor leo dolor nec tellus. Ut ornare pulvinar lacus ut maximus. Sed quis aliquam nisl, sit amet fringilla dui. Donec velit nulla, scelerisque non viverra et, euismod a nunc. Phasellus ut viverra ligula. Nam vehicula, magna sed commodo condimentum, odio nisl fringilla nisl, in interdum nulla lacus quis lacus. Etiam rutrum eget felis ut tristique. Pellentesque erat orci, porta sed consequat vel, gravida lacinia libero. Curabitur bibendum, erat vitae sagittis mollis, nunc leo porta erat, ut iaculis turpis dui ac turpis. Morbi facilisis pretium ligula, sed pulvinar purus volutpat eget. Mauris mollis vehicula diam in tincidunt. Nunc porta posuere lobortis. Nulla vehicula tincidunt mauris, sit amet porta nibh sagittis eu. Cras quis risus at libero commodo faucibus.

Aliquam dictum turpis vitae eros auctor, a ultrices orci commodo. Curabitur rutrum augue ac aliquam fermentum. Vestibulum ut orci rutrum, porttitor urna vitae, gravida ligula. Maecenas sagittis, turpis dictum feugiat imperdiet, magna augue ornare lorem, at lobortis metus nunc mattis turpis. Quisque congue auctor accumsan. Sed posuere ut justo ac eleifend. Ut finibus dolor quis nulla semper vestibulum pharetra vitae nisl. Mauris nec dolor massa.

Integer commodo ligula vel lacus suscipit venenatis convallis non sem. Sed eget urna urna. Phasellus sit amet purus dignissim, porttitor mi ut, convallis lectus. Nulla ante nibh, maximus in turpis vitae, fringilla tincidunt turpis. Nam sit amet ullamcorper nulla. Nunc imperdiet vel elit sit amet malesuada. Nulla cursus feugiat turpis, at efficitur massa. Aenean viverra imperdiet odio, eget porta est luctus sed. In id lobortis neque, a suscipit diam.`;

const loremBytes = new TextEncoder().encode(lorem);

const Template: ComponentStory<typeof Filesystem> = (args) => {

    const [selectedFile, setSelectedFile] = useState<string | undefined>();
    const [page, setPage] = useState(1);

    const data = loremBytes.slice(page * 256, (page + 1) * 256);

    return <Filesystem
        {...args}
        selectedFile={selectedFile}
        selectedFileSize={selectedFile === 'BOOT.BIN' ? loremBytes.length : undefined}
        selectedPage={page}
        pageContents={selectedFile === 'BOOT.BIN' ? data : undefined}
        onUpdate={(file, page) => {
            setSelectedFile(file);
            setPage(page);
        }}
    />;
}

export const MyFilesystem = Template.bind({});
MyFilesystem.args = {
    currentDirectory: "/BOOT/BIN",
    fileList: [
        { filename: "..", fileType: FileType.Directory },
        { filename: "BOOT.BIN", fileType: FileType.File },
        { filename: "KERNEL", fileType: FileType.Directory },
        { filename: "DIRECT", fileType: FileType.Directory },
    ],
};
MyFilesystem.storyName = 'Filesystem';