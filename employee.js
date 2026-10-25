const path = require("path");
const { askRequired, askAge}= require("./helpers");
const {addRow, getNextId}=require("./fileHelpers");

const fileName = path.join(__dirname, "data", "emp.txt");
const headers = ["ID", "Name", "Age", "City","State","Country"];

async function addEmployee(){
    console.log("\n Add Employee Details");
    console.log("-------------------");

    const name = await askRequired("Enter name: ");
    const age = await askAge();
    const city = await askRequired("Enter city: ");
    const state = await askRequired("Enter state: ");
    const country = await askRequired("Enter country: ");

    const id = getNextId(fileName);
    addRow(fileName,headers,[id,name,age,city,state,country]);
    console.log("Employee added successfully. ID ="+ id);
}
module.exports={addEmployee};