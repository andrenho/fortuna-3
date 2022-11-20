export enum FileType { File, Directory };

export type FFile = {
    filename: string,
    fileType: FileType,
    size?: number,
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum, tortor quis fringilla hendrerit, nisi elit convallis tortor, pulvinar auctor leo dolor nec tellus. Ut ornare pulvinar lacus ut maximus. Sed quis aliquam nisl, sit amet fringilla dui. Donec velit nulla, scelerisque non viverra et, euismod a nunc. Phasellus ut viverra ligula. Nam vehicula, magna sed commodo condimentum, odio nisl fringilla nisl, in interdum nulla lacus quis lacus. Etiam rutrum eget felis ut tristique. Pellentesque erat orci, porta sed consequat vel, gravida lacinia libero. Curabitur bibendum, erat vitae sagittis mollis, nunc leo porta erat, ut iaculis turpis dui ac turpis. Morbi facilisis pretium ligula, sed pulvinar purus volutpat eget. Mauris mollis vehicula diam in tincidunt. Nunc porta posuere lobortis. Nulla vehicula tincidunt mauris, sit amet porta nibh sagittis eu. Cras quis risus at libero commodo faucibus.

Aliquam dictum turpis vitae eros auctor, a ultrices orci commodo. Curabitur rutrum augue ac aliquam fermentum. Vestibulum ut orci rutrum, porttitor urna vitae, gravida ligula. Maecenas sagittis, turpis dictum feugiat imperdiet, magna augue ornare lorem, at lobortis metus nunc mattis turpis. Quisque congue auctor accumsan. Sed posuere ut justo ac eleifend. Ut finibus dolor quis nulla semper vestibulum pharetra vitae nisl. Mauris nec dolor massa.

Integer commodo ligula vel lacus suscipit venenatis convallis non sem. Sed eget urna urna. Phasellus sit amet purus dignissim, porttitor mi ut, convallis lectus. Nulla ante nibh, maximus in turpis vitae, fringilla tincidunt turpis. Nam sit amet ullamcorper nulla. Nunc imperdiet vel elit sit amet malesuada. Nulla cursus feugiat turpis, at efficitur massa. Aenean viverra imperdiet odio, eget porta est luctus sed. In id lobortis neque, a suscipit diam.`;

const loremBytes = new TextEncoder().encode(lorem);

export default class Filesystem {

    fileList : FFile[] = [];
    selectedFile?: FFile;
    selectedPage = 0;
    pageContents?: Uint8Array;

    updateFromEmulator(selectedFile: string | undefined, selectedPage: number) {
        
        this.fileList = [
            { filename: "..", fileType: FileType.Directory },
            { filename: "BOOT.BIN", fileType: FileType.File },
            { filename: "KERNEL", fileType: FileType.Directory },
        ]
        
        this.selectedFile = { 
            filename: selectedFile!, 
            fileType: selectedFile === "BOOT.BIN" ? FileType.File : FileType.Directory,
            size: selectedFile === "BOOT.BIN" ? loremBytes.length : 0
        };

        this.selectedPage = selectedPage;

        if (selectedFile === "BOOT.BIN")
            this.pageContents = loremBytes.slice(selectedPage * 256, (selectedPage + 1) * 256);
        else
            this.pageContents = undefined;
    }

}