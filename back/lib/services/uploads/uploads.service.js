"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feathers_blob_1 = __importDefault(require("feathers-blob"));
const fs_blob_store_1 = __importDefault(require("fs-blob-store"));
const multer_1 = __importDefault(require("multer"));
const uploads_model_1 = __importDefault(require("../../models/uploads.model"));
const uploads_class_1 = require("./uploads.class");
const uploads_hooks_1 = __importDefault(require("./uploads.hooks"));
const multipartMiddleware = (0, multer_1.default)();
function default_1(app) {
    const blobStorage = (0, fs_blob_store_1.default)(app.get('uploads'));
    const options = {
        Model: (0, uploads_model_1.default)(app),
        paginate: app.get('paginate')
    };
    const uploads = new uploads_class_1.Uploads(options, app, (0, feathers_blob_1.default)({ Model: blobStorage }));
    uploads.docs = {
        description: 'A service to upload files',
        securities: ['all'],
        operations: {
            update: false,
            patch: false
        },
        definition: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'object',
                    description: 'The file to upload'
                }
            }
        },
        definitions: {
            uploadResponse: {
                type: 'object',
                required: ['id', 'url', 'filename', 'mimetype', 'size', 'createdAt', 'updatedAt'],
                properties: {
                    id: {
                        type: 'number',
                        description: 'The id of the file'
                    },
                    url: {
                        type: 'string',
                        description: 'The url of the file'
                    },
                    filename: {
                        type: 'string',
                        description: 'The name of the file'
                    },
                    mimetype: {
                        type: 'string',
                        description: 'The mimetype of the file'
                    },
                    size: {
                        type: 'number',
                        description: 'The size of the file'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'The date and time of the file creation'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'The date and time of the last file update'
                    }
                }
            },
            uploadsList: {
                type: 'array',
                items: { $ref: '#/components/schemas/uploadResponse' }
            }
        },
        refs: {
            getResponse: 'uploadResponse',
            createResponse: 'uploadResponse',
            removeResponse: 'uploadResponse',
        }
    };
    app.use('/uploads', multipartMiddleware.single('file'), function (req, res, next) {
        req.feathers.file = req.file;
        next();
    }, uploads);
    // Get our initialized service so that we can register hooks
    const service = app.service('uploads');
    service.hooks(uploads_hooks_1.default);
}
exports.default = default_1;
