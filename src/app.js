"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const http = __importStar(require("http"));
let state = "/loading";
const Readline = serialport_1.default.parsers.Readline;
const port = new serialport_1.default('/dev/ttyUSB0', {
    baudRate: 115200
});
const parser = port.pipe(new Readline({
    delimiter: "\n",
    encoding: "ascii",
}));
setInterval(() => {
    let params = {
        path: state
    };
    let options = {
        hostname: "192.168.12.216",
        port: 5000,
        path: "/update",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(params).length
        }
    };
    let req = http.request(options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (body) {
            console.log("body : " + body);
        });
        res.on("error", function (e) {
            console.log("Problem with request: " + e.message);
        });
    });
    req.write(JSON.stringify(params));
    req.end();
}, 1000);
let timer = null;
function serialOpen() {
    port.open(function (msg) {
        if (msg) {
            return console.log(msg.message);
        }
    });
    // The open event is always emitted
    port.on('open', function () {
        console.log("open success!!");
    });
    parser.on('data', () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = setTimeout(() => { state = "/loading"; }, 1000);
        }
        state = "/video";
    });
}
(function main() {
    serialOpen();
    // setInterval(() => {port.write("Godopu") }, 5000, 2000);
})();
