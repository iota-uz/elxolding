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
Object.defineProperty(exports, "__esModule", { value: true });
const authentication = __importStar(require("@feathersjs/authentication"));
const feathers_hooks_common_1 = require("feathers-hooks-common");
// Don't remove this comment. It's needed to format import lines nicely.
const { authenticate } = authentication.hooks;
function populateUrl() {
    const postResolvers = {
        joins: {
            url: () => async (item, context) => {
                item.url = context.app.get('images_url') + `${item.filename}`;
            }
        }
    };
    return (0, feathers_hooks_common_1.fastJoin)(postResolvers);
}
exports.default = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [],
        update: [(0, feathers_hooks_common_1.disallow)('external')],
        patch: [(0, feathers_hooks_common_1.disallow)('external')],
        remove: []
    },
    after: {
        all: [populateUrl()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
