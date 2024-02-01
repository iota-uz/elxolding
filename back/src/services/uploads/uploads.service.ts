import blobService from 'feathers-blob';
import fs from 'fs-blob-store';
import multer from 'multer';

import {Application} from '../../declarations';
import createModel from '../../models/uploads.model';
import {Uploads} from './uploads.class';
import hooks from './uploads.hooks';

const multipartMiddleware = multer();

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        // TODO: proper types
        'uploads': any;
    }
}

export default function (app: Application): void {
    const blobStorage = fs(app.get('uploads'));
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };
    const uploads = new Uploads(options, app, blobService({Model: blobStorage}));
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
                items: {$ref: '#/components/schemas/uploadResponse'}
            }
        },
        refs: {
            getResponse: 'uploadResponse',
            createResponse: 'uploadResponse',
            removeResponse: 'uploadResponse',
        }
    };

    app.use('/uploads',
        multipartMiddleware.single('file'),
        function (req: any, res: any, next: any) {
            req.feathers.file = req.file;
            next();
        },
        uploads
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('uploads');
    service.hooks(hooks);
}
