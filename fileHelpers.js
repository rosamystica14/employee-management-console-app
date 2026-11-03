const fs = require("fs");
const path= require("path");
function parseCSVLine(line) {
    const values = [];
    let value = "";
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                value += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === "," && !insideQuotes) {
            values.push(value);
            value = "";
        } else {
            value += char;
        }
    }
    values.push(value);
    return values;
}

function escapeCSV(value) {
    const text = String(value ?? "");
    if (/[",\r\n]/.test(text)) {
        return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
}

function readTable(fileName) {
    if (!fs.existsSync(fileName)) {
        return [];
    }
    const content = fs.readFileSync(fileName, "utf8").trim();
    if (!content) {
        return [];
    }
    const lines = content.split(/\r?\n/);
    lines.shift();
    return lines.filter(line => line.trim() !== "").map(line => parseCSVLine(line));
}

function writeTable(fileName, headers, rows) {
    fs.mkdirSync(path.dirname(fileName), {
        recursive: true
    });
    const allRows = [headers, ...rows];
    const output = allRows.map(row => row.map(escapeCSV).join(",")).join("\n");
    fs.writeFileSync(fileName, output + "\n", "utf8");
}

function addRow(fileName, headers, row) {
    const rows = readTable(fileName);
    rows.push(row);
    writeTable(fileName, headers, rows);
}

function getNextId(fileName) {
    const rows = readTable(fileName);
    let maxId = 0;
    for (const row of rows) {
        if (Number(row[0]) > maxId) {
            maxId = Number(row[0]);
        }
    }
    return maxId + 1;
}

module.exports = {readTable,writeTable,addRow,getNextId};