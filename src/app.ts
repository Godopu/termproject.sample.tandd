import SerialPort from "serialport";
const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('/dev/ttyS8', {
    baudRate: 115200
})
const parser = port.pipe(new Readline({
    delimiter: "\n",
    encoding: "ascii",
}));


function serialOpen()
{
    port.open(function (msg) {
        if (msg) {
            return console.log(msg.message)
        }
    
        // Because there's no callback to write, write errors will be emitted on the port:
        // port.write('main screen turn on')
    })
    
    // The open event is always emitted
    port.on('open', function () {
        console.log("open success!!");
    })
    parser.on('data', console.log);
}

(function main()
{
    serialOpen();
    // setInterval(() => {port.write("Godopu") }, 5000, 2000);
})();