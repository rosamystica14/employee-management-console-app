const path = require("path");
const {askRequired} = require("./helpers");
const {addRow , getNextId}= require("./fileHelpers");
const fileName = path.join(__dirname, "data","department.txt");
const headers = ["ID","Description"];
async function addDepartment(){
    console.log("\n Add Department Details");
    console.log("------------------");
    const description = await askRequired("Enter description: ","Description");
    const id = getNextId(fileName);
    addRow(fileName,headers,[id,description]);
    console.log("Department added successfully. ID = "+id);
}
module.exports={addDepartment};