"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploads = void 0;
const node_buffer_1 = require("node:buffer");
const dauria_1 = __importDefault(require("dauria"));
const feathers_sequelize_1 = require("feathers-sequelize");
const fs = __importStar(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
function dataURItoBlob(dataURI) {
    const byteString = Buffer.from(dataURI.split(',')[1]).toString('base64');
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new node_buffer_1.Blob([ia], { type: mimeString });
}
async function resize(src, dst, size = 200) {
    const file = (0, sharp_1.default)(src);
    const meta = await file.metadata();
    return file.resize({
        width: Math.min(size, meta.width || 0),
        fit: sharp_1.default.fit.contain
    }).webp({ quality: 75 }).toFile(dst);
}
async function toWebp(src, dst) {
    const res = await (0, sharp_1.default)(src).webp({ quality: 100 }).toFile(dst);
    await fs.rm(src);
    return res;
}
class Uploads extends feathers_sequelize_1.Service {
    constructor(options = {}, app, blobService) {
        super(options);
        this.app = app;
        this.blobService = blobService;
    }
    async create(data, params) {
        let uri;
        if (params.file) {
            const file = params.file;
            uri = dauria_1.default.getBase64DataURI(file.buffer, file.mimetype);
        }
        else {
            uri = data.file;
        }
        const blob = dataURItoBlob(uri);
        const result = await this.blobService.create({ uri }, params);
        const basePath = this.app.get('uploads') + '/';
        const filename = basePath + result.id;
        const mimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const adaptiveSize = {
            mimetype: 'image/webp',
        };
        if (mimetypes.includes(blob.type)) {
            const basename = result.id.split('.')[0];
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
exports.Uploads = Uploads;
