const path = require("path");
const { askDate, askEndDate } = require("./helpers");
const { readTable } = require("./fileHelpers");
const { toNumber, isOverlapping } = require("./dateUtils");

const empFile = path.join(__dirname, "data", "emp.txt");
const deptFile = path.join(__dirname, "data", "department.txt");
const assignFile = path.join(__dirname, "data", "assignment.txt");

function nameOf(rows, id) {
    const found = rows.find((row) => row[0] === id);
    return found ? found[1] : "Unknown";
}

function printRows(headers, rows) {
    const widths = headers.map((h, i) => {
        let max = h.length;
        for (const row of rows) {
            if (row[i].length > max) {
                max = row[i].length;
            }
        }
        return max;
    });

    function format(values) {
        return values.map((v, i) => v.padEnd(widths[i])).join("   ");
    }

    console.log(format(headers));
    for (const row of rows) {
        console.log(format(row));
    }
}

async function askRangeEnd(startDate) {
    while (true) {
        const end = await askEndDate("Enter end date (mm-dd-yyyy): ", startDate);
        if (end !== "") {
            return end;
        }
        console.log("End date is required.");
    }
}

async function viewByDate() {
    console.log("\n View Employees By Date");
    console.log("----------------------");

    const date = await askDate("Enter date (mm-dd-yyyy): ");

    const employees = readTable(empFile);
    const departments = readTable(deptFile);
    const assignments = readTable(assignFile);

    const found = assignments.filter((row) => isOverlapping(date, date, row[3], row[4]));
    found.sort((a, b) => Number(a[1]) - Number(b[1]));       

    console.log("\n--------------------");
    console.log("Employees working on: " + date + ".");

    if (found.length === 0) {
        console.log("No employees were working on this date.");
    } else {
        const lines = found.map((row) => [nameOf(employees, row[1]), nameOf(departments, row[2])]);
        printRows(["Employee", "Department"], lines);
    }
    console.log("--------------------");
}

async function viewByRange() {
    console.log("\n View Employees By Date Range");
    console.log("----------------------------");

    const startDate = await askDate("Enter start date (mm-dd-yyyy): ");
    const endDate = await askRangeEnd(startDate);            

    const employees = readTable(empFile);
    const departments = readTable(deptFile);
    const assignments = readTable(assignFile);

    const found = assignments.filter((row) => isOverlapping(startDate, endDate, row[3], row[4]));

    found.sort((a, b) => {
        if (a[1] !== b[1]) {
            return Number(a[1]) - Number(b[1]);
        }
        return toNumber(a[3]) - toNumber(b[3]);
    });

    console.log("\n--------------------");
    console.log("Employees working from " + startDate + " to " + endDate + ".");

    if (found.length === 0) {
        console.log("No employees were working in this date range.");
    } else {
        const lines = found.map((row) => [
            nameOf(employees, row[1]),
            nameOf(departments, row[2]),
            row[3],
            row[4] === "" ? "Current" : row[4]
        ]);
        printRows(["Employee", "Department", "Start Date", "End Date"], lines);
    }
    console.log("--------------------");
}

module.exports = { viewByDate, viewByRange };