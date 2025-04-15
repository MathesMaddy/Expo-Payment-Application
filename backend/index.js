const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const DBClient = require('./models/DBClient');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const moment = require('moment');
require('dotenv').config()
const secret = process.env.JWT_SECRET;
const genSalt = bcrypt.genSalt(10);
const PORT = process.env.PORT || 4000;
const cors = require('cors');

const PaymentFailed = require('./middleware/PaymentFailedLog');

const PaymentPending = require('./middleware/PaymentPendingLog');
const ErrorEventLog = require('./middleware/ErrorEventLog');
// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 6-digit number
};
// transfer money to bank using bank details
app.post('/bank-transfer', async(req, res) => {
    const client = DBClient();
    try {        
        const { token, bankAccountNumber, ifscCode, amount, pin } = req.body;
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login users collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    console.log(userId)
                    const loginUserBalance = await loginUserCollection.findOne({ userId : userId }, {
                        projection : {
                            _id : 0,
                            fullName : 1,
                            accountBalace : 1,
                            passwordPin : 1                     
                        }
                    })
                    let transactionId = `transactionId${Date.now()}`
                    const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                    if(loginUserBalance.passwordPin !== Number(pin.join('')) ) {
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction 
                        const result = await transactionsCollection.insertOne({
                            transactionId : transactionId,                            
                            senderName : loginUserBalance.fullName,
                            receiverName : `XXXXX${bankAccountNumber.slice(-4)}`,
                            sender : userId,
                            receiver : bankAccountNumber,
                            ifscCode : ifscCode,
                            paymentAmount : Number(amount),
                            paymentStatus : 'failed',
                            createdAt : createdDate
                        })  
                        await client.close();
                        return res.status(400).json(transactionId)
                    }
                    // checking account balance
                    console.log('z')
                    
                    if(loginUserBalance.accountBalace >= Number(amount)) {
                        console.log('zz')
                        // reduce account balance from sender account
                        const updateBalance = await loginUserCollection.updateOne({ userId : userId }, { $inc : { accountBalace : -Number(amount) }});
                        let transactionId = `transactionId${Date.now()}`
                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction 
                        const result = await transactionsCollection.insertOne({
                            transactionId : transactionId,                            
                            senderName : loginUserBalance.fullName,
                            receiverName : `XXXXX${bankAccountNumber.slice(-4)}`,
                            sender : userId,
                            receiver : bankAccountNumber,
                            ifscCode : ifscCode,
                            paymentAmount : Number(amount),
                            paymentStatus : 'paid',
                            createdAt : createdDate
                        })  
                        if(result.acknowledged) {    
                            await client.close();
                            return res.status(200).json(transactionId);
                        }
                        else {
                            await client.close();    
                            return res.status(400).json('no history');
                        }
                    } 
                    else {
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction 
                        const result = await transactionsCollection.insertOne({
                            transactionId : transactionId,                            
                            senderName : loginUserBalance.fullName,
                            receiverName : `XXXXX${bankAccountNumber.slice(-4)}`,
                            sender : userId,
                            receiver : bankAccountNumber,
                            ifscCode : ifscCode,
                            paymentAmount : Number(amount),
                            paymentStatus : 'failed',
                            createdAt : createdDate
                        })  
                        await client.close();
                        return res.status(400).json(transactionId)
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');        
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error')
    }
})
// making payment using upi-id
app.post('/pay-upi-id', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { upiId, amount, token, passwordPin } = req.body;
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login users collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    const loginUserUpiId = await loginUserCollection.findOne({ userId : userId }, {
                        projection : {
                            _id : 0,
                            upiId : 1,
                            fullName : 1,
                            accountBalace : 1,
                            passwordPin : 1
                        }
                    })
                    console.log(loginUserUpiId)
                    let transactionId = `transactionId${Date.now()}`
                    const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }); 
                    // checking user is paying to the own upi id
                    if(Number(passwordPin.join('')) === loginUserUpiId.passwordPin) {
                        // checking account balance
                        console.log('z')
                        if(loginUserUpiId.accountBalace >= Number(amount)) {
                            // reduce account balance from sender
                            console.log('zz')
                            const updateBalance = await loginUserCollection.updateOne({ userId : userId }, { $inc : { accountBalace : - Number(amount) }})
                            // adding account balance to receiver
                            const updateUPIIdBalance = await loginUserCollection.findOneAndUpdate({ upiId : upiId }, { $inc : { accountBalace : + Number(amount) }}, {
                                projection : {
                                    _id : 0, fullName : 1
                                }
                            })

                            console.log(updateUPIIdBalance)
                            let transactionId = `transactionId${Date.now()}`
                            const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                            let transactionsCollectionName = 'usersTransactions';
                            const transactionsCollection = db.collection(transactionsCollectionName);
                            // creating new transaction
                            const result = await transactionsCollection.insertOne({
                                transactionId : transactionId,
                                senderName : loginUserUpiId.fullName,
                                receiverName : upiId,
                                sender : userId,
                                receiver : upiId,
                                paymentAmount : Number(amount),
                                paymentStatus : 'paid',
                                createdAt : createdDate
                            })        
                            if(result.acknowledged) {
                                await client.close();
                                return res.status(200).json(transactionId);
                            }
                            else {
                                await client.close();
                                return res.status(400).json('transfer pending');
                            }                            
                        }
                        else {
                            await client.close();
                            return res.status(400).json('Insufficient balance')
                        }
                    }
                    else {
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction
                        const result = await transactionsCollection.insertOne({
                                transactionId : transactionId,
                                senderName : loginUserUpiId.fullName,
                                receiverName : upiId,
                                sender : userId,
                                receiver : upiId,
                                paymentAmount : Number(amount),
                                paymentStatus : 'failed',
                                createdAt : createdDate
                        })       
                        await client.close();
                        return res.status(400).json(transactionId);
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})
// make payment to person to person using phone number
app.post('/make-payment', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, phoneNo, amount, pin } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId, fullName } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    const findUser = await loginUserCollection.findOne({ phoneNo : Number(phoneNo) }, {
                        projection : {
                            _id : 0,
                            upiId : 1,
                            userId : 1,
                            fullName : 1
                        }
                    })
                    console.log(findUser)
                    if(findUser === null) {
                        await client.close();
                        return res.status(400).json('user does not exists')
                    }
                    // checking user is not to same
                    if(findUser && findUser.userId !== userId) {
                        // compare pin is correct are not
                        const pinMatch = await loginUserCollection.findOne({ userId : userId,$expr : { $eq : [ '$passwordPin' , Number(pin.join(''))]} }, {
                            projection : {
                                _id : 0,
                                fullName : 1
                            }
                        })
                        // creating transaction id, date
                        let transactionId = `transactionId${Date.now()}`
                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        // transactions collection
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        if(pinMatch) {
                            // reduce amount from sender 
                            const UserAccount = await loginUserCollection.updateOne({ userId : userId, accountBalace : { $gte : Number(amount) } }, {
                                $inc : { accountBalace : -Number(amount) }
                            })
                            if(UserAccount.acknowledged) {
                                // adding account balance to receiver                                
                                const addAmount = await loginUserCollection.updateOne({ userId : findUser.userId }, { $inc : { accountBalace : +Number(amount) }})
                                // if transaction success create tranasaction history with paid
                                if(addAmount.acknowledged) {
                                    // creating new transaction

                                    const result = await transactionsCollection.insertOne({
                                        transactionId : transactionId,
                                        senderName : pinMatch.fullName,
                                        receiverName : findUser.fullName,
                                        sender : userId,
                                        receiver : findUser.userId,
                                        paymentAmount : Number(amount),
                                        paymentStatus : 'paid',
                                        createdAt : createdDate
                                    })
                                    if(result.acknowledged) {

                                        await client.close();
                                        return res.status(200).json(transactionId);
                                    }
                                    else {
                                        await client.client()
                                        return res.status(400).json('Server problem');
                                    }
                                }
                                // else create tranasaction history with pending
                                else {
                                    PaymentPending('Transaction Pending', `sender : ${userId}`, `receiver : ${findUser.userId}`, amount, 'PaymentPending')
                                    const result = await transactionsCollection.insertOne({
                                        transactionId : transactionId,
                                        senderName : pinMatch.fullName,
                                        receiverName : findUser.fullName,
                                        sender : userId,
                                        receiver : findUser.userId,
                                        paymentAmount : Number(amount),
                                        paymentStatus : 'pending',
                                        createdAt : createdDate
                                    })
                                    if(result.acknowledged) {
                                        await client.close();
                                        return res.json(400).json('Transaction pending')
                                    }
                                    else {
                                        await client.close();
                                        return res.json(400).json('Server problem')
                                    }
                                }
                            }
                            else {
                                PaymentFailed('Insufficient balance', 'PaymentFailedLogs')
                                const result = await transactionsCollection.insertOne({
                                    transactionId : transactionId,
                                    senderName : userId,
                                    receiverName : findUser.fullName,
                                    sender : userId,
                                    receiver : findUser.userId,
                                    paymentAmount : Number(amount),
                                    paymentStatus : 'failed',
                                    createdAt : createdDate
                                })
                                if(result.acknowledged) {
                                    await client.close();
                                    return res.status(400).json('Insufficient balance')
                                }
                                else {
                                    await client.close();
                                    return res.status(400).json('Server problem')
                                }
                            }
                        }
                        else {
                            const result = await transactionsCollection.insertOne({
                                transactionId : transactionId,
                                senderName : fullName,
                                receiverName : findUser.fullName,
                                sender : userId,
                                receiver : findUser.userId,
                                paymentAmount : Number(amount),
                                paymentStatus : 'failed',
                                createdAt : createdDate
                            })
                            if(result.acknowledged) {
                                await client.close();
                                return res.status(400).json(transactionId)
                            }
                            else {
                                await client.close();
                                return res.status(400).json('Server problem')
                            }
                        }
                    } 
                    else {
                        await client.close();
                        return res.status(400).json('can not pay your own account')
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        ErrorEventLog(e, 'ErrorEventLog')
        return res.status(400).json('Error');
    }
})
app.post('/check-phone-number', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, phoneNo } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    if(phoneNo.length === 1) {
                        const findUser = await loginUserCollection.findOne({ phoneNo : Number(phoneNo[0]) }, {
                            projection : {
                                _id : 0,
                                
                                userId : 1,
                                fullName : 1, phoneNo : 1
                            }
                        })
                        console.log(findUser)
                        if(findUser) {

                            await client.close();
                            const result = {
                                id: findUser?.userId, 
                                name: findUser?.fullName,                             
                                phoneNumbers: findUser?.phoneNo.toString(), 
                                section : findUser?.fullName?.charAt(0)
                            }    
                            console.log(result)                     
                            return res.status(200).json(result)
                        }
                        else {
                            await client.close();
                            return res.status(400).json('user not found')
                        }
                    }
                    else {
                        const phoneNumbers = phoneNo.map(contact => Number(contact.phoneNumbers));
                        console.log(phoneNumbers)
                        const findUser = await loginUserCollection.find({ phoneNo : { $in : phoneNumbers } }, {
                            projection : {
                                _id : 0,
                                phoneNo : 1
                            }
                        }).toArray()
                        console.log(findUser)
                        const result = findUser.map(item => {
                            const matchedContact = phoneNo.find(contact => Number(contact.phoneNumbers) === item.phoneNo);
                            return {
                              id: matchedContact?.id, 
                              name: matchedContact?.name, 
                              phoneNumbers: item.phoneNo.toString(), 
                              section : matchedContact.name.charAt(0)
                            };
                        }).sort((a, b) => a.section.localeCompare(b.section));
                        if(result.length) {
                            console.log(result)
                            await client.close();
                            return res.status(200).json(result)
                        }
                        else {
                            await client.close();
                            return res.status(400).json('no contacts found');
                        }
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})


app.post('/check-recent-upi-pay', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let usersTransactionsCollectionName = 'usersTransactions';
                    const usersTransactionCollection = db.collection(usersTransactionsCollectionName);
                    const transactionsList = await usersTransactionCollection.aggregate([
                            {
                            $match: {
                                sender: userId,
                                receiver: { $regex: /@yahvipay$/i } // match UPI IDs only
                            }
                            },
                            {
                            $group: {
                                _id: "$receiver", // group by receiver UPI
                                latestTransaction: { $last: "$$ROOT" } // or $first/$max for latest
                            }
                            },
                            {
                            $replaceRoot: {
                                newRoot: "$latestTransaction"
                            }
                            },
                            {
                                $project : {
                                    _id : 0,
                                    receiver : 1
                                }
                            }
                        ]).toArray();
                    if(transactionsList.length) {

                        let tranasactionId = transactionsList.map((item) => item.receiver);                        
                        const loginUsersCollectionName = 'loginUsers';
                        const loginUserCollection = db.collection(loginUsersCollectionName);
                        let users = await loginUserCollection.find({ upiId : { $in : tranasactionId }}, {
                            projection : {
                                _id : 0,
                                fullName : 1,
                                upiId : 1
                            }
                        }).toArray()    
                        users = users.map(item => ({
                            ...item,
                            profileImage : item.fullName.charAt(0)
                        }))
                        if(users.length) {
                            console.log('q')
                            await client.close();
                            return res.status(200).json(users)
                        }   
                        else {
                            await client.close();
                            return res.status(400).json('user not found')
                        }                 
                    }
                    else {
                        await client.close();
                        return res.status(400).json('no recent transactions')
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/check-recent-bank-transfer', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let usersTransactionsCollectionName = 'usersTransactions';
                    const usersTransactionCollection = db.collection(usersTransactionsCollectionName);
                    let transactionsList = await usersTransactionCollection.aggregate([
                            {
                            $match: {
                                sender: userId,
                                receiver: { $regex: /^[0-9]+$/i } // match UPI IDs only
                            }
                            },
                            {
                            $group: {
                                _id: "$receiver", // group by receiver UPI
                                latestTransaction: { $last: "$$ROOT" } // or $first/$max for latest
                            }
                            },
                            {
                            $replaceRoot: {
                                newRoot: "$latestTransaction"
                            }
                            },
                            {
                                $project : {
                                    _id : 0,
                                    receiverName : 1,
                                    receiver : 1,
                                    ifscCode : 1
                                }
                            }
                        ]).toArray();
                    console.log(transactionsList)
                    if(transactionsList.length) {
                        await client.close();
                        transactionsList = transactionsList.map(item => ({
                            ...item,
                            profileImage : item.ifscCode.charAt(0)
                        }))
                        
                        return res.status(200).json(transactionsList)
                    }   
                    else {
                        await client.close();
                        return res.status(400).json('no recent bank transaction')
                    }                 
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})
app.post('/get-user-transaction', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, phoneNo } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    const findUser = await loginUserCollection.findOne({ phoneNo : Number(phoneNo) }, {
                            projection : {
                                _id : 0,
                                userId : 1,
                                fullName : 1
                            }
                    })
                    
                    if(findUser) {

                        let usersTransactionsCollectionName = 'usersTransactions';
                        const userTransactionsCollection = db.collection(usersTransactionsCollectionName);
                        const transactions = await userTransactionsCollection.find({ 
                            $or: [
                                { sender : userId, receiver : findUser.userId }, 
                                { sender : findUser.userId, receiver : userId }  
                            ]}, 
                            {
                                projection : {
                                    _id : 0,
                                    transactionId : 1,
                                    sender : 1,
                                    receiver : 1,
                                    paymentAmount : 1,
                                    paymentStatus : 1,
                                    createdAt : 1,
                                }
                            }
                        ).toArray()
                        if(transactions.length) {
                            let result = transactions.map(item => ({                                
                                ...item,
                                sender : item.sender === userId ? 'send' : item.sender,
                                dateTime: moment(item.createdAt, 'M/D/YYYY, h:mm:ss A').toDate(),
                                createdAt : moment(item.createdAt, 'M/D/YYYY, h:mm:ss A').format('LL')
                            })); 
                            console.log(result)
                            const messages = await loginUserCollection.findOne({ $or : [{ userId : userId }, { phoneNo : Number(phoneNo) }] }, { projection : { _id : 0, message : 1 }})
                            console.log(messages)
                            if(messages) {
                                let message = messages.message.map(item => ({
                                    ...item,
                                    sender : item.sender === userId ? 'send' : item.sender,
                                    time : moment(item.createdAt, 'M/D/YYYY, h:mm:ss A').format('h:mm A'),
                                    dateTime: moment(item.createdAt, 'M/D/YYYY, h:mm:ss A').toDate(), 
                                    createdAt : moment(item.createdAt, 'M/D/YYYY, h:mm:ss A').format('LL')
                                }))
                                result = [ ...result, ...message ].sort((a, b) => a.dateTime - b.dateTime);
                                console.log(result)
                                await client.close();                        
                                return res.status(200).json(result)
                            }
                            else {
            
                            
                            await client.close();                        
                            return res.status(200).json(result)
                        }
                        }                    
                        else {
                            await client.close();                        
                            return res.status(404).json('no transaction')
                        }
                    }
                    else {
                        await client.close();
                        return res.status(404).json('user account not be created')
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/send-user-message', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, phoneNo, message } = req.body
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    const findUser = await loginUserCollection.findOne({ phoneNo : Number(phoneNo) }, {
                        projection : {
                            _id : 0,
                            userId : 1,
                            fullName : 1
                        }
                    })
                    if(findUser) {

                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        
    
                        const result = await loginUserCollection.findOneAndUpdate({ userId : userId }, { $push : { message : { text : message, sender : userId, receiver : findUser.userId, createdAt : createdDate }}}, {
                            projection : {
                                _id : 0,
                                userId : 1,
                            }
                        })

                        let sendMessage = {
                            text : message,
                            sender : 'send',
                            receiver : findUser.userId,
                            time : moment(createdDate, 'M/D/YYYY, h:mm:ss A').format('h:mm A'),
                             
                            createdAt : moment(createdDate, 'M/D/YYYY, h:mm:ss A').format('LL')
                        }

                        if(result) {
                            await client.close();
                            return res.status(200).json(sendMessage)
                        }
                        else {

                            await client.close();
                            return res.status(400).json('message not post')
                        }
                    }
                    else {
                        await client.close();
                        
                        return res.status(400).json('User is not created')
                    }
                    
                    
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/get-upi-id', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, transactions } = req.body
        console.log(token)
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    let result = await loginUserCollection.findOne({ userId : userId }, {
                        projection : {
                            _id : 0,
                            fullName : 1,
                            phoneNo : 1,
                            upiId : 1
                        }
                    })
                    if(transactions) {
                        let usersTransactionsName = 'usersTransactions';
                        const usersTransactionsCollection = db.collection(usersTransactionsName);
                        let transaction = await usersTransactionsCollection.find({ userId : userId }, {
                            projection : {
                                _id : 0,
                                transactionId : 1,
                                senderName : 1,
                                sender : 1,
                                receiver : 1,
                                receiverName : 1,
                                paymentAmount : 1,
                                paymentStatus : 1,
                                createdAt : 1
                            }
                        }).sort({ createdAt : - 1 }).limit(3).toArray();
                        if(transaction.length) {
                            await client.close();
                            return res.status(200).json({ result : result, transaction : transaction });
                        }
                        else {
                            await client.close();
                            return res.status(200).json({ result : result, transaction : []});
                        }
                    }
                    else {
                        if(result) {
                            await client.close();
                            return res.status(200).json(result);
                        }
                        else {
                            await client.close();
                            return res.status(400).json('user is not created')
                        }                    
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/forget-pin', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, phoneNo } = req.body
        console.log(token)
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    let otp = generateOTP()
                    let result = await loginUserCollection.findOneAndUpdate({ userId : userId }, { $set : { tempOTP : otp }}, {
                        projection : {
                            _id : 0,
                            fullName : 1,                            
                        }
                    })
                    if(result) {

                        await client.close();
                        return res.status(200).json(otp)
                        
                    }
                    else {
                        await client.close();
                        
                        return res.status(400).json('opt is not created');                 
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/change-pin', async(req, res) => {
    const client = DBClient();
    try {
        console.log(req.body);
        const { token, pin } = req.body
        console.log(token)
        if(token) {
            jwt.verify( token, secret, { }, async(err, info) => {                
                if(err) throw err                
                if(info) {
                    const { userId } = info;
                    await client.connect();
                    let dbName = 'yahvipay'
                    const db = client.db(dbName);
                    // login user collection
                    let loginUsersCollectionName = 'loginUsers';
                    const loginUserCollection = db.collection(loginUsersCollectionName);
                    let result = await loginUserCollection.findOneAndUpdate({ userId : userId }, { $set : { passwordPin : Number(pin.join('')) }}, {
                        projection : {
                            _id : 0,
                            fullName : 1,                            
                        }
                    })
                    if(result) {
                        await client.close();
                        return res.status(200).json('ok')                        
                    }
                    else {
                        await client.close();                        
                        return res.status(400).json('opt is not created');                 
                    }
                }
                else {
                    return res.status(400).json('unauthorized user');
                }
            })
        }
        else { 
            return res.status(400).json('unauthorized user');
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})
// creating new user
app.post('/verify-otp', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { otp, token } = req.body;
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        // checking OTP
        if(otp.length !== 4 || isNaN(otp)) return res.status(400).json('not valid otp')
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            console.log(info)
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection
            let loginUsersCollectionName = 'loginUsers';
            const loginUserCollection = db.collection(loginUsersCollectionName);
            const tempOTP = await loginUserCollection.findOneAndUpdate({ userId : userId, tempOTP : otp }, { $unset : { tempOTP : '' }})
            if(tempOTP) {
                const result = await loginUserCollection.findOne({ phoneNo : phoneNo }, {
                    projection : {
                        _id : 0,
                        fullName : 1,
                        bankName : 1,
                        bankAccountNumber : 1,
                        ifscCode : 1,
                        aadharNumber : 1,
                        panCard : 1
                    }
                })
                console.log(result)
                if(result.fullName && result.bankName && result.bankAccountNumber && result.ifscCode && result.aadharNumber && result.panCard) {
                    await client.close();
                    return res.status(200).json('kyc verified');
                }
                else {
                    await client.close();
                    return res.status(400).json('kyc details is not verified');
                }
            }
            else {
                await client.close();
                return res.status(406).json('invalid OTP')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/history', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, page, limit, months, categories, status } = req.body;        
        let skip = (parseInt(page) - 1) * parseInt(limit);
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err;             
            console.log(info)            
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection            
            let collectionName = 'usersTransactions';
            const usersTransactionCollection = db.collection(collectionName);
            let matchStage = {
                $or : [
                    { sender : userId }, { receiver : userId }
                ]
            }

            
            // Date filtering
            if (months !== '') {
                const now = moment();
                let startDate;
            
                if (months == 0) {
                startDate = now.startOf('month').format('M/D/YYYY');
                } else if (months == 30) {
                startDate = now.subtract(30, 'days').format('M/D/YYYY');
                } else if (months == 90) {
                startDate = now.subtract(90, 'days').format('M/D/YYYY');
                }
                console.log(startDate)
                matchStage.createdAt = { $gte: startDate };
            }
            
            if (categories !== '') {
                if (categories === 'send') {
                matchStage.sender = userId;
                } else if (categories === 'received') {
                matchStage.receiver = userId;
                }
            }
            
            if (status !== '') {
                matchStage.paymentStatus = status;
            }          
            console.log(matchStage)
            let result = await usersTransactionCollection.aggregate([
                { $match : matchStage },
                { $sort : { createdAt : - 1 }},
                { $skip : skip },
                { $limit : Number(limit) }
            ]).toArray();
            console.log(result.length)
            if(result.length) {
                await client.close();                
                let finalResult = result.map(item => ({
                    ...item,
                    createdAt : moment(item.createdAt, "M/D/YYYY, h:mm:ss A").fromNow()

                }))
                // const monthString = [ ...new Set(result.map((item) => moment(item.createdAt, "M/D/YYYY, h:mm:ss A").format('MMMM'))) ]
                // console.log(monthString)
                return res.status(200).json({ userId : userId, finalResult : finalResult });
            }
            else {
                await client.close();
                return res.status(406).json('no transactions found.')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/check-upi-id', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, upiId } = req.body;
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        // checking OTP
        // if(otp.length !== 4 || isNaN(otp)) return res.status(400).json('not valid otp')
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            console.log(info)
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection
            let collectionName = 'loginUsers';
            const loginUsersCollection = db.collection(collectionName);
            const result = await loginUsersCollection.findOne({ upiId : upiId }, {
                projection : {
                    _id : 0,
                    upiId : 1
                }
            });
            console.log(result)
            if(result) {
                await client.close();
                return res.status(200).json(result);
            }
            else {
                await client.close();
                return res.status(406).json('user not having upi id')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/pay-upi-id', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, upiId, amount, pin } = req.body;
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        // checking OTP
        // if(otp.length !== 4 || isNaN(otp)) return res.status(400).json('not valid otp')
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            console.log(info)
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection
            let collectionName = 'loginUsers';
            const loginUserCollection = db.collection(collectionName);
            const result = await loginUserCollection.findOne({ userId : userId }, {
                projection : {
                    _id : 0,
                    upiId : 1,
                }
            });
            console.log(result)
            if(result && findUser.upiId !== upiId) {
                const findUser = await loginUserCollection.findOne({ upiId : upiId }, {
                    projection : {
                        _id : 0,
                        upiId : 1,
                    }
                });
                if(!findUser) {
                    await client.close();
                    return res.status(400).json('upi id does not exists')
                }
                console.log('z')
                // reduce account balance from sender
                const pinMatch = await loginUserCollection.findOne({ userId : userId, $expr : { $eq : [ '$passwordPin' , Number(pin.join(''))]} }, {
                    projection : {
                        _id : 0,
                        fullName : 1
                    }
                })
                console.log(pinMatch)
                if(pinMatch) {
                    const UserAccount = await loginUserCollection.updateOne({ userId : userId, accountBalace : { $gte : Number(amount) } }, {
                        $inc : { accountBalace : -Number(amount) }
                    })
                    console.log(UserAccount)
                    if(UserAccount.acknowledged) {
                        console.log('zzz')
                        // adding account balance to receiver
                        const addAmount = await loginUserCollection.updateOne({ userId : findUser.upiId }, { $inc : { accountBalace : +Number(amount) }})
                        console.log(addAmount)
                        let transactionId = `transactionId${Date.now()}`
                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction
                        const result = await transactionsCollection.insertOne({
                            transactionId : transactionId,
                            senderName : pinMatch.fullName,
                            receiverName : findUser.fullName,
                            sender : userId,
                            receiver : findUser.upiId,
                            paymentAmount : Number(amount),
                            paymentStatus : 'paid',
                            createdAt : createdDate
                        })
                        if(result.acknowledged) {
                            console.log('zzzz')
                            await client.close();
                            return res.status(200).json('successfully transfer');
                        }
                        else {
                            await client.client()
                            return res.status(400).json('transfer pending');
                        }
                    }
                    else {
                        await client.close();
                        return res.status(400).json('Insufficient balance')
                    }
                }
                else {
                    await client.close();
                    return res.status(400).json('Invalid pin');
                }
            } 
            else {
                await client.close();
                return res.status(400).json('can not pay your own account')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/qr-scan-pay', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, upiId, amount, pin } = req.body;
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        // checking OTP
        // if(otp.length !== 4 || isNaN(otp)) return res.status(400).json('not valid otp')
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            
            console.log(info)
            
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection
            
            let collectionName = 'loginUsers';
            const loginUserCollection = db.collection(collectionName);
            const result = await loginUserCollection.findOne({ userId : userId }, {
                projection : {
                    _id : 0,
                    upiId : 1,
                    accountBalace : 1,
                    passwordPin : 1
                }
            });
            console.log(result)
            if(result && result.upiId !== upiId) {
                console.log('z')
                // reduce account balance from sender
                const pinMatch = await loginUserCollection.findOne({ userId : userId, $expr : { $eq : [ '$passwordPin' , Number(pin.join(''))]} }, {
                    projection : {
                        _id : 0,
                        fullName : 1
                    }
                })
                console.log(pinMatch)
                if(pinMatch) {
                    const UserAccount = await loginUserCollection.updateOne({ userId : userId, accountBalace : { $gte : Number(amount) } }, {
                        $inc : { accountBalace : -Number(amount) }
                    })
                    console.log(UserAccount)
                    if(UserAccount.acknowledged) {
                        console.log('zzz')
                        // adding account balance to receiver
                        let transactionId = `transactionId${Date.now()}`
                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        let transactionsCollectionName = 'usersTransactions';
                        const transactionsCollection = db.collection(transactionsCollectionName);
                        // creating new transaction
                        const result = await transactionsCollection.insertOne({
                            transactionId : transactionId,
                            senderName : pinMatch.fullName,
                            receiverName : upiId,
                            sender : userId,
                            receiver : upiId,
                            paymentAmount : Number(amount),
                            paymentStatus : 'paid',
                            createdAt : createdDate
                        })
                        if(result.acknowledged) {
                            console.log('zzzz')
                            await client.close();
                            return res.status(200).json('successfully transfer');
                        }
                        else {
                            await client.client()
                            return res.status(400).json('transfer pending');
                        }
                    }
                    else {
                        await client.close();
                        return res.status(400).json('Insufficient balance')
                    }
                }
                else {
                    await client.close();
                    return res.status(400).json('Invalid pin');
                }
            } 
            else {
                await client.close();
                return res.status(400).json('can not pay your own account')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/check-balance', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, pin } = req.body;
        // checking token
        if(!token) return res.status(400).json('user not authorized') 
        // checking OTP
        // if(otp.length !== 4 || isNaN(otp)) return res.status(400).json('not valid otp')
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            
            console.log(info)
            
            const { userId, phoneNo } = info
            await client.connect();
            let dbName = 'yahvipay'
            const db = client.db(dbName);
            // login users collection
            
            let collectionName = 'loginUsers';
            const loginUsersCollection = db.collection(collectionName);
            const result = await loginUsersCollection.findOne({ userId : userId, $expr : { $eq : [ '$passwordPin' , Number(pin.join(''))]} }, {
                projection : {
                    _id : 0,
                    accountBalace : 1
                }
            });
            console.log(result)
            if(result) {
                await client.close();
                return res.status(200).json(result);
            }
            else {
                await client.close();
                return res.status(400).json('Invalid pin')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

// user login
app.post('/login-user', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body);
        const { phoneNo } = req.body;
        // checking valid input or not
        if(Number(phoneNo).toString().length !== 10) return res.status(400).json('Invalid phone number')
        // connecting db
        await client.connect();
       
        let dbName = 'yahvipay'
        const db = client.db(dbName);
        let loginUsersCollectionName = 'loginUsers';
        const loginUserCollection = db.collection(loginUsersCollectionName);

        const generateOTP = () => {
            return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 6-digit number
        };
          
        console.log(generateOTP());

        const result = await loginUserCollection.findOne({ phoneNo : Number(phoneNo) }, {
            projection : {
                _id : 0,
                userId : 1
            }
        });        
        if(result) {
            const otp = generateOTP()
            const insertOTP = await loginUserCollection.findOneAndUpdate({ phoneNo : Number(phoneNo) }, {
                $set : { tempOTP : otp }
            })
            if(insertOTP) {
                await client.close();
                let userId = Object.values(result)
                jwt.sign({ phoneNo, userId : userId[0] }, secret, {},(err, token) => {
                    if(err) throw err
                    return res.status(200).json({ token : token, success : otp })
                })
            }
            else {
                await client.close();
                return res.status(200).json('otp not generate')
            }
        }
        else {
            const otp = generateOTP()
            const userId = `userId${Date.now()}`
            let upiId = `${phoneNo}@yahvipay`
            const createUser = await loginUserCollection.insertOne({
                userId : userId,
                upiId : upiId,
                phoneNo : Number(phoneNo),
                fullName : '',
                bankName : '',
                bankAccountNumber : '',
                ifscCode : '',
                accountBalace : '',
                aadharNumber : '',
                panCard : '',
                tempOTP : otp
            })
            if(createUser.acknowledged) {
                await client.close();
                jwt.sign({ phoneNo, userId }, secret, {},(err,token) => {
                    if(err) throw err
                    return res.status(200).json({ token : token, success : otp })
                })
            }
        }
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.post('/kyc-details', async(req, res) => {
    const client = DBClient();
    console.log(req.body)
    try {        
        const { token, details } = req.body
        const { passwordPin, fullName, bankName, bankAccountNumber, ifscCode, aadharNumber, panCard } = details;
        // checking phone number 
        // if(!isNaN(Number(phoneNo))) return res.status(400).json('Invalid phone number') 
        // checking account number
        // if(!isNaN(Number(bankAccountNumber))) return res.status(400).json('Invalid Bank Account Number') 
        // phone number should be length 10
        // if(Number(phoneNo).toString().length !== 10) return res.status(400).json('Invalid phone number')
        // password pin should be length 6
        // if(Number(passwordPin).toString().length !== 6) return res.status(400).json('Password Pin should be 6')
        // checking all the input details is given
        // if(!fullName && !email && !bankName && !bankAccountNumber && !ifscCode && !Number(aadharNumber) && !panCard) {
            // return res.status(400).json('details required')
        // }
        console.log(req.body);
        // const { phoneNo } = req.body;
        // checking valid input or not
        // if(Number(phoneNo).toString().length !== 10) return res.status(400).json('Invalid phone number')
        // connecting db
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err; 
            
            console.log(info)
            
            const { userId, phoneNo } = info
        await client.connect();
        let dbName = 'yahvipay'
        const db = client.db(dbName);
        let loginUsersCollectionName = 'loginUsers';
        const loginUserCollection = db.collection(loginUsersCollectionName);
        console.log(userId)
        const result = await loginUserCollection.findOneAndUpdate({ userId : userId }, {
            $set : {
                fullName : fullName,
                bankName : bankName,
                bankAccountNumber : bankAccountNumber,
                ifscCode : ifscCode,
                accountBalace : 2000,
                aadharNumber : aadharNumber,
                panCard : panCard,  
                passwordPin : Number(passwordPin)     
            }     
        });        
        if(result) {
            const insertOTP = await loginUserCollection.findOneAndUpdate({ phoneNo : Number(phoneNo) }, {
            
                $unset : { tempOTP : '' }
            })
            if(insertOTP) {
                await client.close();
                return res.status(200).json('success')
            }
            else {
                await client.close();
                return res.status(200).json('error')
            }
        }
        else {
            await client.close();
            return res.status(200).json('user not found');
        }
    })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

// mobile recharge
app.post('/mobile-recharge', async(req, res) => {
    const client = DBClient();
    try {        
        console.log(req.body)
        const { token, phoneNo, billType, price, passwordPin } = req.body;
        if(!token) return res.status(400).json('User not authenticate')
        // checking phone number 
        if(!/^\d{10}$/.test(phoneNo)) return res.status(400).json('Invalid phone number') 
        // checking account number
        if(isNaN(price) || Number(price) <= 0) return res.status(400).json('Invalid Payment Plan') 
        // checking account number
        if(!isNaN(billType)) return res.status(400).json('Invalid recharge plan') 
        // phone number should be length 10
        if(Number(phoneNo).toString().length !== 10) return res.status(400).json('Invalid phone number')
        // password pin should be length 6
        if(!/^\d{6}$/.test(passwordPin.join(''))) return res.status(400).json('Password Pin should be 6')
        // checking all the input details is given
        if(!phoneNo && !billType && !price) {
            return res.status(400).json('details required')
        }
        jwt.verify(token, secret, {}, async(err, info) => {
            if(err) throw err
            if(info) {
                const { userId } = info
                await client.connect();
                let dbName = 'yahvipay'
                const db = client.db(dbName);
                // login users collection
                let loginUsersCollectionName = 'loginUsers';
                const loginUserCollection = db.collection(loginUsersCollectionName);
                const checkAccountBalance = await loginUserCollection.findOne({ userId : userId }, {
                    projection : {
                        _id : 0,
                        
                        fullName : 1,
                        accountBalace : 1
                    }
                })
                // checking account balance
                console.log('z')
                if(checkAccountBalance.accountBalace >= Number(price)) {
                    
                    // update user account balance 
                    const result = await loginUserCollection.findOneAndUpdate({ userId : userId }, { $inc : { accountBalace : - Number(price)} }, {
                        projection : {
                            _id : 0,
                            userId : 1
                        }
                    })
                    console.log(result)
                    if(result) {
                        let usersTransactionsCollectionName = 'usersTransactions';
                        const userTransactionsCollection = db.collection(usersTransactionsCollectionName);
                        let transactionId = `transactionId${Date.now()}`
                        const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                        // create new transaction
                        const createdTransaction = await userTransactionsCollection.insertOne({
                            transactionId : transactionId,
                            senderName : checkAccountBalance.fullName,
                            receiverName : billType,
                            sender : userId,
                            receiver : billType,
                            paymentAmount : Number(price),
                            paymentStatus : 'paid',
                            createdAt : createdDate
                        })
                        if(createdTransaction.acknowledged) {
                            await client.close();
                            return res.status(200).json('successfully recharge');
                        }
                        else {    
                            await client.close();
                            return res.status(400).json('transfer pending');
                        }
                    }
                    else {
                        await client.close();
                        return res.status(400).json('problem with recharge');
                    }
                }
                else { 
                    await client.close();
                    return res.status(400).json('Insufficient balance');
                }
            }
            else {
                await client.close();
                return res.status(400).json('User not authenticate')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

// dth recharge
app.post('/dth-recharge', async(req, res) => {
    const client = DBClient();
    try {        
        const { token, dthNumber, billType, price, passwordPin } = req.body;
        if(!token) return res.status(400).json('User not authenticate')
        // checking phone number 
        if(!/^\d{10}$/.test(dthNumber)) return res.status(400).json('Invalid phone number') 
        // checking account number
        if(isNaN(price) || Number(price) <= 0) return res.status(400).json('Invalid Payment Plan') 
        // checking account number
        if(!isNaN(billType)) return res.status(400).json('Invalid recharge plan') 
        // // phone number should be length 10
        // if(Number(phoneNo).toString().length !== 10) return res.status(400).json('Invalid phone number')
        // password pin should be length 6
        if(!/^\d{6}$/.test(passwordPin.join(''))) return res.status(400).json('Invalid Pin')
        // checking all the input details is given
        if(!dthNumber && !rechargePlan && !paymentAmount) {
            return res.status(400).json('details required')
        }
        jwt.verify(token, secret, {}, async(err, info) => {
            if(err) throw err
            if(info) {
                const { userId } = info
                await client.connect();
                let transactionId = `transactionId${Date.now()}`
                const createdDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                let dbName = 'yahvipay'
                const db = client.db(dbName);
                // login users collection
                let loginUsersCollectionName = 'loginUsers';
                const loginUserCollection = db.collection(loginUsersCollectionName);
                const checkAccountBalance = await loginUserCollection.findOne({ userId : userId }, {
                    projection : {
                        _id : 0,
                        fullName : 1,
                        accountBalace : 1
                    }
                })
                // checking user account balance
                if(checkAccountBalance.accountBalace >= Number(price)) {
                    // update the user account balance
                    const result = await loginUserCollection.findOneAndUpdate({ userId : userId }, { $inc : { accountBalace : - Number(price)}}, {
                        projection : {
                            
                            _id : 0,
                            fullName : 1
                        }
                    })
                    console.log(result)
                    if(result) {
                        let usersTransactionsCollectionName = 'usersTransactions';
                        const userTransactionsCollection = db.collection(usersTransactionsCollectionName);
                        // create new transaction
                        const createdTransaction = await userTransactionsCollection.insertOne({
                            transactionId : transactionId,
                            senderName : checkAccountBalance.fullName,
                            receiverName : billType,
                            sender : userId,
                            receiver : billType,
                            paymentAmount : Number(price),
                            paymentStatus : 'paid',
                            createdAt : createdDate
                        })
                        if(createdTransaction.acknowledged) {
                            await client.close();
                            return res.status(200).json('successfully recharge');
                        }
                        else {    
                            await client.close();
                            return res.status(400).json('transfer pending');
                        }
                    }
                    else {
                        await client.close();
                        return res.status(400).json('problem with recharge');
                    }
                }
                else { 
                    await client.close();
                    return res.status(400).json('Insufficient balance');
                }
            }
            else {
                await client.close();
                return res.status(400).json('User not authenticate')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error');
    }
})

app.get('/mobile-recharge-plan', async(req, res) => {
    const client = DBClient();
    try {
        const { token } = req.cookies;
        if(token) return res.status(400).json('User not authenticate')
        jwt.verify(token, secret, {}, async(err, info) => {
            if(err) throw err
            if(info) {
                const { userId } = info
                await client.connect();
                let dbName = 'yahvipay'
                const db = client.db(dbName);
                // recharges collection
                let rechargeCollectionName = 'recharges';
                const rechargeCollection = db.collection(rechargeCollectionName);
                // get mobile recharge plan's
                const mobileRecharge = rechargeCollection.findOne({ mobileRecharge }, {
                    projection : {
                        _id : 0
                    }
                })
                if(mobileRecharge.acknowledged) {
                    await client.close();
                    return res.status(200).json(mobileRecharge)
                }
                else {
                    await client.close();
                    return res.status(400).json('problem getting plan')
                }
            }
            else {
                await client.close();
                return res.status(400).json('User not authenticate')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error')
    }
})

app.get('/dth-recharge-plan', async(req, res) => {
    const client = DBClient();
    try {
        const { token } = req.cookies;
        if(token) return res.status(400).json('User not authenticate')
        jwt.verify(token, secret, {}, async(err, info) => {
            if(err) throw err
            if(info) {
                const { userId } = info
                await client.connect();
                let dbName = 'yahvipay'
                const db = client.db(dbName);
                // recharges collection
                let rechargeCollectionName = 'recharges';
                const rechargeCollection = db.collection(rechargeCollectionName);
                // get dth recharge plan's
                const dthRecharge = rechargeCollection.findOne({ dthRecharge }, {
                    projection : {
                        _id : 0
                    }
                })
                if(dthRecharge.acknowledged) {
                    await client.close();
                    return res.status(200).json(dthRecharge)
                }
                else {
                    await client.close();
                    return res.status(400).json('problem getting plan')
                }
            }
            else {
                await client.close();
                return res.status(400).json('User not authenticate')
            }
        })
    }
    catch(e) {
        await client.close();
        return res.status(400).json('Error')
    }
})

app.listen(PORT, console.log(`Server is listening ${PORT}`));