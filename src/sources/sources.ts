import {DataElement} from "../models/models";

export default interface Source {
    getContents: () => Promise<DataElement[]>

    getContent: (url: string) => Promise<{ title: string, content: string[] }>
}