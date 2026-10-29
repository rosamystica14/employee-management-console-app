const readline = require ("readline");
const {isValidDate, toNumber} = require("./dateUtils");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question){
    return new Promise((resolve)=>{
        rl.question(question,(answer)=>{
            resolve(answer.trim());
        });
    });
}

async function askRequired(question, label){
    while(true){
        const answer = await askQuestion(question);
        if(answer===""){
            console.log(label+" is required.");
        }else if(answer.includes("|")){
            console.log("The character | is not allowed.");
        }else{
            return answer;
        }
    }
}

async function askText(question, label){
    while(true){
        const answer = await askQuestion(question);
        if(answer===""){
            console.log(label+" is required.");
        }else if(!/^\p{L}[\p{L} .'-]*$/u.test(answer)){
            console.log(label+" must contain only letters.");
        }else{
            return answer;
        }
    }
}

async function askAge(){
    while(true){
        const answer = await askQuestion("Enter age: ");
        const age = Number(answer);
        if(answer===""){
            console.log("Age is required.");
        }else if(!Number.isInteger(age)){
            console.log("Enter age in integer format.");
        }else if(age<18 || age> 65){
            console.log("Age must be between 18 and 65.");
        }else{
            return age;
        }
    }
}
async function askDate(question){
    while(true){
        const answer = await askQuestion(question);
        if (answer ===""){
            console.log("Date is required.");
        }else if (!isValidDate(answer)){
            console.log("Enter a valid date in mm-dd-yyyy format.");
        }else {
            return answer;
        }
    }
}

async function askEndDate(question, startDate){
    while(true){
        const answer = await askQuestion(question);
        if(answer===""){
            return "";
        }else if(!isValidDate(answer)){
            console.log("Enter a valid date in mm-dd-yyyy format.");
        }else if (toNumber(answer)<toNumber(startDate)){
            console.log("End date cannot be earlir than the start date.");
        }else {
            return answer;
        }
    }
}
module.exports={askQuestion,askRequired,askText,askAge,askDate,askEndDate,rl};