const path = require('path');
const { format } = require('date-fns');
const { v4:uuid } = require('uuid');
const fs = require('fs')
const fsPromises = require('fs').promises


const PaymentFailedLog = async (message, fileName) => {
    let dataTime = format(new Date(), 'yyyy MM dd\tHH:mm:ss')    
    let paymentFailedLog = `${dataTime}\t${uuid()}\t${message}\n`    
    if(!fs.existsSync(path.join(__dirname,'..','logs'))) {
        await fsPromises.mkdir(path.join(__dirname,'..','logs'))
    }
        
    await fsPromises.appendFile(path.join(__dirname,'..','logs',`${fileName}`), paymentFailedLog)
    
}
module.exports = PaymentFailedLog;