const path = require("path");
const { askQuestion, askDate, askEndDate, nameOf } = require("./helpers");
const { readTable, writeTable, addRow, getNextId } = require("./fileHelpers");
const { toNumber, isOverlapping } = require("./dateUtils");
const empFile = path.join(__dirname, "data", "emp.txt");
const deptFile = path.join(__dirname, "data", "department.txt");
const assignFile = path.join(__dirname, "data", "assignment.txt");
const headers = ["ID", "EmpID", "DeptID", "StartDate", "EndDate"];

function printList(title, rows, nameIndex) {
    console.log("\n" + title);
    for (const row of rows) {
        console.log(row[0] + " - " + row[nameIndex]);
    }
    console.log("");
}

async function askExistingId(question, rows) {
    while (true) {
        const id = await askQuestion(question);
        const found = rows.find((row) => row[0] === id);
        if (found) {
            return id;
        }
        console.log("ID not found. Try again.");
    }
}

async function askEndDateRequired(question, startDate) {
    while (true) {
        const end = await askEndDate(question, startDate);
        if (end !== "") {
            return end;
        }
        console.log("End date is required here.");
    }
}

//assign a department
async function assignDepartment() {
    console.log("\n Assign Department");
    console.log("--------------------");

    const employees = readTable(empFile);
    const departments = readTable(deptFile);
    if (employees.length === 0 || departments.length === 0) {
        console.log("Add at least one employee and one department first.");
        return;
    }

    printList("Employees:", employees, 1);
    const empId = await askExistingId("Enter employee ID: ", employees);

    printList("Departments:", departments, 1);
    const deptId = await askExistingId("Enter department ID: ", departments);

    const startDate = await askDate("Enter start date (mm-dd-yyyy): ");
    const endDate = await askEndDate("Enter end date (mm-dd-yyyy, press Enter if still working): ", startDate);

    
    const old = readTable(assignFile).filter((row) => row[1] === empId);

    
    for (const row of old) {
        if (isOverlapping(startDate, endDate, row[3], row[4])) {
            if (row[2] === deptId && row[4] === "") {
                console.log("This employee is already working in this department.");
            } else {
                console.log("These dates overlap another assignment of this employee.");
                console.log("To move the employee to a new department, use Change Department.");
            }
            return;
        }
    }

    const id = getNextId(assignFile);
    addRow(assignFile, headers, [id, empId, deptId, startDate, endDate]);
    console.log(nameOf(employees, empId) + " assigned to " + nameOf(departments, deptId) + ".");
}

//change department
async function changeDepartment() {
    console.log("\n Change Department");
    console.log("--------------------");

    const employees = readTable(empFile);
    const departments = readTable(deptFile);
    if (employees.length === 0 || departments.length === 0) {
        console.log("Add at least one employee and one department first.");
        return;
    }

    printList("Employees:", employees, 1);
    const empId = await askExistingId("Enter employee ID: ", employees);

    const rows = readTable(assignFile);
    const current = rows.find((row) => row[1] === empId && row[4] === "");

    if (!current) {
        console.log("This employee has no current department. Use Assign Department.");
        return;
    }

    console.log("Current department: " + nameOf(departments, current[2]) + " (since " + current[3] + ")");

    printList("Departments:", departments, 1);
    let newDeptId = await askExistingId("Enter new department ID: ", departments);
    while (newDeptId === current[2]) {
        console.log("That is the current department. Choose a different one.");
        newDeptId = await askExistingId("Enter new department ID: ", departments);
    }

    const oldEnd = await askEndDateRequired("Enter end date of current department (mm-dd-yyyy): ", current[3]);

    let newStart = await askDate("Enter start date of new department (mm-dd-yyyy): ");
    while (toNumber(newStart) <= toNumber(oldEnd)) {
        console.log("New start date must be after " + oldEnd + ".");
        newStart = await askDate("Enter start date of new department (mm-dd-yyyy): ");
    }

    const newEnd = await askEndDate("Enter end date (mm-dd-yyyy, press Enter if still working): ", newStart);

    const others = rows.filter((row) => row[1] === empId && row !== current);
    for (const row of others) {
        if (isOverlapping(newStart, newEnd, row[3], row[4])) {
            console.log("The new dates overlap another assignment of this employee.");
            return;                              
        }
    }

    const id = getNextId(assignFile);
    current[4] = oldEnd;
    rows.push([id, empId, newDeptId, newStart, newEnd]);
    writeTable(assignFile, headers, rows);

    console.log("Department changed successfully.");
}

module.exports = { assignDepartment, changeDepartment };