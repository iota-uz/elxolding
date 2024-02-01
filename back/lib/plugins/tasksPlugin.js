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
/* eslint-disable @typescript-eslint/no-unused-vars */
const fsSync = __importStar(require("fs"));
const fs = __importStar(require("fs/promises"));
const path_1 = require("path");
const logger_1 = __importDefault(require("../logger"));
const utils_1 = require("../utils");
async function runTasks(app, path) {
    var _a;
    const root = (0, path_1.dirname)((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
    const tasksFolder = `${root}/${path}`;
    if (!fsSync.existsSync(tasksFolder)) {
        logger_1.default.warn(`Tasks folder ${tasksFolder} does not exist`);
        return;
    }
    const files = await fs.readdir(tasksFolder);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const modules = files.map(el => require(`${root}/${path}/${el}`).default);
    const promises = modules.map(async (module) => {
        // eslint-disable-next-line no-constant-condition
        while (1) {
            try {
                await module.run(app);
            }
            catch (e) {
                logger_1.default.warn(e);
            }
            await (0, utils_1.sleep)(module.every * 1000);
        }
    });
    await Promise.all(promises);
}
function registerTasks(path) {
    return (app) => {
        runTasks(app, path).catch(e => {
            logger_1.default.warn('Task schedule', e);
        });
    };
}
exports.default = registerTasks;
