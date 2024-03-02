"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
class TestController {
    isOnline(req, res) {
        res.status(200).json({ message: "Is online" });
    }
}
exports.TestController = TestController;
