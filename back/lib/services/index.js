"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_service_1 = __importDefault(require("./rpc/rpc.service"));
const uploads_service_1 = __importDefault(require("./uploads/uploads.service"));
const users_service_1 = __importDefault(require("./users/users.service"));
function default_1(app) {
    app.configure(rpc_service_1.default);
    app.configure(users_service_1.default);
    app.configure(uploads_service_1.default);
}
exports.default = default_1;
