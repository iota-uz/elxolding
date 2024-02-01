"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.sleep = exports.replacePattern = exports.validateTemplate = exports.randomChoice = exports.escapeRegExp = exports.stripNonNumeric = void 0;
const util_1 = __importDefault(require("util"));
function stripNonNumeric(text) {
    var _a;
    const digits = (_a = text.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.join('');
    if (!digits)
        throw new Error('No digits found');
    return digits;
}
exports.stripNonNumeric = stripNonNumeric;
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
function randomChoice(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}
exports.randomChoice = randomChoice;
function findAndReplace(str, find, replace) {
    for (let i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(escapeRegExp(find[i]), 'gi'), replace[i]);
    }
    return str;
}
function evaluateExpression(value, expr) {
    const accessors = expr.split('.').slice(1);
    return accessors.reduce((result, accessor) => result[accessor], value);
}
function validateTemplate(template, pattern, whitelist) {
    const matches = template.match(pattern);
    if (!matches) {
        return null;
    }
    for (const match of matches) {
        if (!whitelist.includes(match)) {
            return match;
        }
    }
    return null;
}
exports.validateTemplate = validateTemplate;
function replacePattern(template, pattern, value) {
    const matches = template.match(pattern);
    if (!matches) {
        return template;
    }
    const values = matches.map((match) => evaluateExpression(value, match));
    return findAndReplace(template, matches, values);
}
exports.replacePattern = replacePattern;
exports.sleep = util_1.default.promisify(setTimeout);
function isProd() {
    return ['production', 'rinat'].includes(process.env.NODE_ENV);
}
exports.isProd = isProd;
