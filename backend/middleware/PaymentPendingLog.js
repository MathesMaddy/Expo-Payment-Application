const path = require('path');
const { format } = require('date-fns');
const { v4:uuid } = require('uuid');
const fs = require('fs')
const fsPromises = require('fs').promises


const PaymentPendingLog = async (status, sender, receiver, amount, fileName) => {
    let dataTime = format(new Date(), 'yyyy MM dd\tHH:mm:ss')    
    let paymentPendingLog = `${dataTime}\t${uuid()}\t${status}\t${sender}\t${receiver}\t${amount}\n`    
    if(!fs.existsSync(path.join(__dirname,'..','logs'))) {
        await fsPromises.mkdir(path.join(__dirname,'..','logs'))
    }
        
    await fsPromises.appendFile(path.join(__dirname,'..','logs',`${fileName}`), paymentPendingLog)
    
}
module.exports = PaymentPendingLog;