const path = require("path");
const { askRequired, askAge, askText}= require("./helpers");
const {addRow, getNextId}=require("./fileHelpers");

const fileName = path.join(__dirname, "data", "emp.txt");
const headers = ["ID", "Name", "Age", "City","State","Country"];

async function addEmployee(){
    console.log("\n Add Employee Details");
    console.log("-------------------");

    const name = await askText("Enter name: " , "Name");
    const age = await askAge();
    const city = await askText("Enter city: ", "City");
    const state = await askText("Enter state: " , "State");
    const country = await askText("Enter country: " , "Country");

    const id = getNextId(fileName);
    addRow(fileName,headers,[id,name,age,city,state,country]);
    console.log("Employee added successfully. ID ="+ id);
}
module.exports={addEmployee};