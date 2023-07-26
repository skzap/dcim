let cmd = "hid-query /dev/hidraw0 0x01 0x80 0x33 0x01 0x00 0x00 0x00 0x00 | grep -A1 ^Response| tail -1"
let logFile = "log.csv"
import {exec} from 'child_process'
import * as fs from 'fs'

exec(cmd, (error, stdout, stderr) => {
	let data = stdout.split("\n")[0]
	data = data.trim()
	data = data.split(' ')
	let temp = data[2] + data[3]
	let hum = data[6] + data[7]
	temp = parseInt(temp, 16)/100
	hum = parseInt(hum, 16)/100
	let time = new Date().getTime()

	let line = time+','+temp+','+hum

	// save to log file
	fs.appendFile(logFile, line+'\n', function (err) {
		if (err) throw err;
		console.log(line);
	});
});
