import {Blob} from 'node:buffer';

import dauria from 'dauria';
import bService from 'feathers-blob';
import {Service} from 'feathers-sequelize';
import * as fs from 'fs/promises';
import sharp, {OutputInfo} from 'sharp';

import {Application} from '../../declarations';

function dataURItoBlob(dataURI: string) {
    const byteString = Buffer.from(dataURI.split(',')[1]).toString('base64');
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
}

async function resize(src: string, dst: string, size: number = 200): Promise<OutputInfo> {
    const file = sharp(src);
    const meta = await file.metadata();
    return file.resize({
        width: Math.min(size, meta.width || 0),
        fit: sharp.fit.contain
    }).webp({quality: 75}).toFile(dst);
}

async function toWebp(src: string, dst: string): Promise<OutputInfo> {
    const res = await sharp(src).webp({quality: 100}).toFile(dst);
    await fs.rm(src);
    return res;
}

interface ServiceOptions {
}

export class Uploads extends Service {
    app: Application;
    blobService: bService.Service;

    constructor(options: ServiceOptions = {}, app: Application, blobService: bService.Service) {
        super(options);
        this.app = app;
        this.blobService = blobService;
    }

    async create(data: any, params: any) {
        let uri: string;
        if (params.file) {
            const file = params.file;
            uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
        } else {
            uri = data.file;
        }
        const blob = dataURItoBlob(uri);
        const result = await this.blobService.create({uri}, params);
        const basePath = this.app.get('uploads') + '/';
        const filename = basePath + result.id;
        const mimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const adaptiveSize: Record<string, any> = {
            mimetype: 'image/webp',
        };
        if (mimetypes.includes(blob.type)) {
            const basename = result.id!.split('.')[0];
            adaptiveSize.filename = `${basename}-full.webp`;
            adaptiveSize.xsFilename = `${basename}-xs.webp`;
            adaptiveSize.mdFilename = `${basename}-md.webp`;
            const [full, xs, md] = await Promise.all([
                toWebp(filename, basePath + adaptiveSize.filename),
                resize(filename, basePath + adaptiveSize.xsFilename, 200),
                resize(filename, basePath + adaptiveSize.mdFilename, 400),
            ]);
            adaptiveSize.size = full.size;
            adaptiveSize.xsSize = xs.size;
            adaptiveSize.mdSize = md.size;
        }
        return super.create({
            filename: result.id,
            size: result.size,
            mimetype: blob.type,
            ...adaptiveSize,
        }, params);
    }
}
