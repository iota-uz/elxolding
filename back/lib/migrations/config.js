"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const env = process.env.NODE_ENV || 'development';
const dialect = 'postgres'; // Or your dialect name
exports.default = {
    [env]: {
        dialect,
        url: app_1.default.get(dialect),
        migrationStorageTableName: '_migrations'
    }
};
