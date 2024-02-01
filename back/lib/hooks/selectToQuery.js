"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectToQuery = void 0;
function selectToQuery() {
    return (context) => {
        if (!context.params.query) {
            return;
        }
        if (!context.params.query.$select) {
            return;
        }
        const select = context.params.query.$select;
        if (!select.length) {
            return;
        }
        context.params.fastJoinQuery = {};
        for (const key of select) {
            context.params.fastJoinQuery[key] = true;
        }
    };
}
exports.selectToQuery = selectToQuery;
