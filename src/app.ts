import SerialPort from "serialport";
import * as http from "http";

let state = "/loading";

const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
});

const parser = port.pipe(new Readline({
    delimiter: "\n",
    encoding: "ascii",
}));

setInterval(()=>{
    let params = {
        path : state
    };

    let options : http.RequestOptions = {
        hostname : "192.168.12.216",
        port : 5000,
        path : "/update",
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
}, 1000);

let timer : NodeJS.Timeout | null = null;

function serialOpen()
{
    port.open(function (msg) {
        if (msg) {
            return console.log(msg.message)
        }
    })
    
    // The open event is always emitted
    port.on('open', function () {
        console.log("open success!!");
    })
    parser.on('data', (data)=>{
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{console.log("Hello");state = "/loading"}, 1000)
        state = "/video";
    });
}

(function main()
{
    serialOpen();
    // setInterval(() => {port.write("Godopu") }, 5000, 2000);
})();