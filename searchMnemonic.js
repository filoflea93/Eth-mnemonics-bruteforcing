const bip39 = require("bip39");
const ethers = require('ethers');
const axios = require("axios");
var Mnemonic = require('bitcore-mnemonic');
const Web3 = require('web3');
const checkBalancesCall = require('ethereum-erc20-token-balances-multicall')

// Web3 Provider
WEB3_PROVIDER_URL = "<PUT UR WEB3 PROVIDER URL HERE>";

// Data for sending the email
const userEmail = "<Enter your outlook/hotmail email that will send the message>";
const passUser = "<Enter the password of the email that will send the message>";
const toEmail = "<Enter the mail who will receive the message>";

// Balance
var balance

async function validateMnemonic(mnemonic){

    console.clear();
    console.log("Trying: "+mnemonic+" ...\n");

    let isValid = bip39.validateMnemonic(mnemonic);
     
    if(isValid){

        return true;

    }else{

        return false;

    }

}

async function searchMnemonic(){

    let notEmpty = false;

    while(!notEmpty){

        while(!isValid){
           
            var code = new Mnemonic(Mnemonic.Words.ENGLISH);
            var mnemonic = code.toString();

            var isValid = await validateMnemonic(mnemonic);

        }

        const address = ethers.Wallet.fromMnemonic(mnemonic).address;
        console.log("Address: "+ address + "\n");

        notEmpty = await checkBalance(address);

        if(notEmpty == false){

            isValid = false;

        }else{

           let message = `|Address=> ${address}| |Mnemonic=> ${mnemonic}| |Balance=> ${this.balance}|`;

           console.clear();
           console.log(message);
           sendMail(message);

        }

    }

}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function checkBalance(address){

    let callOk = false;

    while(!callOk)

        try{
            var provider = WEB3_PROVIDER_URL;    
            var web3Provider = new Web3.providers.HttpProvider(provider);
            var web3 = new Web3(web3Provider);

            // get balance
            const weiBalance = await web3.eth.getBalance(address);
        
            this.balance = Web3.utils.fromWei(weiBalance, 'ether');
        
            if(this.balance > 0){
                return true;
            }else{
                return false;
            }

            callOk = true;;

        }catch(e){

            await sleep(10000);
        
            callOk = false;

        }

}

async function sendMail(message){

    var nodemailer = require('nodemailer');

    // hotmail here but you can use what you want..
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        auth: {
            user: userEmail,
            pass: passUser
        },
        tls : { rejectUnauthorized: false }
    });

    try{
        await transporter.sendMail({
            from: userEmail,
            to: toEmail,
            subject: 'Found wallet with balance!',
            text: message
        });
    }catch(e){
        console.log(e);
    };
}

searchMnemonic();