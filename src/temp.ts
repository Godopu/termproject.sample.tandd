import SerialPort from "serialport";
import * as http from "http";
let config = require("../config.json");
let state = "/loading";

const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600
});

const parser = port.pipe(new Readline({
    delimiter: "\n",
    encoding: "utf8",
}));


function sendUpdateMessage(t : number, h : number){
    let params = {
        temp : t,
        humi : h
    };

    let options : http.RequestOptions = {
        hostname: config["ip-adr"],
        port: config["port"],
        path : "/temp",
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
            "Content-Length" : JSON.stringify(params).length
        }
    }; 

    let req = http.request(options, function(res){
        res.setEncoding("utf8");
    
        res.on("data", function(body){
            console.log("body : " + body);
        })
        res.on("error", function(e){
            console.log("Problem with request: " + e.message);
        });
    });

    req.write(JSON.stringify(params));
    req.end();
}

let timer : NodeJS.Timeout | null = null;

function serialOpen()
{
    port.open(function (msg) {
        if (msg) {
            return console.log(msg.message)
        }
    })
    
    parser.on('data', (data : string)=>{
        let chunk = data.split(",")
        sendUpdateMessage(Number.parseInt(chunk[0]), Number.parseInt(chunk[1]))
    });

    parser.on("data", console.log)
}

(function main()
{
    serialOpen();
    // setInterval(() => {port.write("Godopu") }, 5000, 2000);
})();