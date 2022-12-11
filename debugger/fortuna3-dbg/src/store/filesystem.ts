import { Fortuna3Emulator, FilesystemFile, FileType } from "fortuna3-emu";
import { makeAutoObservable } from "mobx";

export default class Filesystem {

    fileList : FilesystemFile[] = [];
    selectedFile?: FilesystemFile;
    selectedPage = 0;
    pageContents?: Uint8Array;
    currentPath = "";

    private emulator : Fortuna3Emulator;

    constructor(emulator: Fortuna3Emulator) {
        makeAutoObservable(this);
        this.emulator = emulator;
        this.updateFromEmulator(undefined, 0);
    }

    updateFromEmulator(selectedFile: string | undefined, selectedPage: number) {

        if (selectedFile === undefined) {
            this.currentPath = "/";
            this.fileList = this.emulator.fsDir("/");
            this.selectedFile = undefined;
            this.pageContents = undefined;
            this.selectedPage = 0;
        } else {
            const fileListRef = this.fileList.find(ff => ff.filename === selectedFile);
            if (fileListRef === undefined) {
                throw new Error("File not found in file list.");
            } else if (fileListRef!.fileType === FileType.File) {
                this.selectedFile = fileListRef;
                this.selectedPage = selectedPage;
                this.pageContents = this.emulator.fsFilePage(this.currentPath, selectedFile, selectedPage);
            } else if (selectedFile === "..") {
                this.currentPath = this.emulator.fsChdirUp(this.currentPath);
                this.fileList = this.emulator.fsDir(this.currentPath);
                this.selectedFile = undefined;
                this.pageContents = undefined;
                this.selectedPage = 0;
            } else {
                this.fileList = this.emulator.fsDir(this.currentPath + "/" + selectedFile);
                this.currentPath += "/" + selectedFile;
                this.selectedFile = undefined;
                this.pageContents = undefined;
                this.selectedPage = 0;
            }
        }
        
    }

}