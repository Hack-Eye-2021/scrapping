import {promises as fs} from 'fs'
import {S3} from 'aws-sdk'
import moment from 'moment'
import {DataElement} from "../models/models";

const Bucket = 'hawk-eye-sources'

const config = {
    target: 'DISK'
}
const persist = async (source, data: DataElement[]) => {
    return persistors[config.target](source, JSON.stringify(data));
}

const persistDisk = async (source, json) => {
    const date = moment().format('DD-MM-YYYY')
    const key = getKey(source, '-');
    await fs.writeFile('./' + key, json)
    return key
}

function getKey(source, separator = '/') {
    const date = moment().format('DD-MM-YYYY')
    const time = moment().format('HH-mm')
    return `${source}${separator}${date}${separator}${time}.json`;
}

const persistS3 = async (source, json: string) => {
    const Key = getKey(source);
    const s3 = new S3()
    return s3.upload({
        Bucket,
        Key,
        ContentType: 'application/JSON',
        Body: json
    }).promise()
}

const persistors = {
    'DISK': persistDisk,
    'S3': persistS3
}

export default persist