"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const Readline = serialport_1.default.parsers.Readline;
const port = new serialport_1.default('/dev/ttyS8', {
    baudRate: 115200
});
const parser = port.pipe(new Readline({
    delimiter: "\n",
    encoding: "ascii",
}));
function serialOpen() {
    port.open(function (msg) {
        if (msg) {
            return console.log(msg.message);
        }
        // Because there's no callback to write, write errors will be emitted on the port:
        // port.write('main screen turn on')
    });
    // The open event is always emitted
    port.on('open', function () {
        console.log("open success!!");
    });
    parser.on('data', console.log);
}
(function main() {
    serialOpen();
    // setInterval(() => {port.write("Godopu") }, 5000, 2000);
})();
