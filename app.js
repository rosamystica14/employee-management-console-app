const {askQuestion,rl}=require("./helpers");
const {addEmployee}=require("./employee");
async function main(){
    let running = true;
    while(running){
        console.log("Employee Department Management");
        console.log("------------------------------");
        console.log("1. Add Employee");
        console.log("2. Add Department");
        console.log("3. Assign department to employee");
        console.log("4. View employees by date");
        console.log("5. View employees by start and end date");
        console.log("6. Exit");

        const choice = await askQuestion("Enter your choice: ");
        if (choice === "1"){
            await addEmployee();
        }else if(choice === "6"){
            console.log("Exiting program.");
            running = false;
        }else{
            console.log("Enter the valid choice");
        }
    }
    rl.close();
}
main();
