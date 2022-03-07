import {DataElement} from "../models/models";

export default interface Source {
    getContents: () => Promise<string[]>

    getContent: (url: string) => Promise<{ title: string, content: string[] }>
}