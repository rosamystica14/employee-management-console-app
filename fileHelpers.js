const fs = require("fs");
const path = require("path");
function readTable(fileName){
    if(!fs.existsSync(fileName)){
        return [];
    }
    const lines = fs.readFileSync(fileName, "utf8").split("\n");
    const rows = [];
    for (const line of lines){
        const text = line.trim();
        if (text.startsWith("|")){
            const parts = text.split("|").map((p)=>p.trim());
            parts.shift();
            parts.pop();
            rows.push(parts);
        }
    }
    rows.shift();
    return rows;
}

function writeTable(fileName,headers,rows){
    fs.mkdirSync(path.dirname(fileName),{recursive: true});
    const widths = headers.map((h, i)=>{
        let max = h.length;
        for (const row of rows){
            if(String (row[i]).length>max){
                max=String(row[i]).length;
            }
        }
        return max;
    });

    const border = "+"+widths.map((w)=>"-".repeat(w+2)).join("+")+"+";

    function formatRow(values){
        const cells = values.map((v, i)=>" "+String(v).padEnd(widths[i])+" ");
        return "|"+cells.join("|")+"|";
    }

    let output = border + "\n"+ formatRow(headers)+"\n"+border +"\n";
    for (const row of rows){
        output += formatRow(row)+"\n";
    }
    output +=border +"\n";
    fs.writeFileSync(fileName, output);
}

function addRow(fileName,headers, row){
    const rows = readTable(fileName);
    rows.push(row);
    writeTable(fileName,headers,rows);
}

function getNextId(fileName){
    const rows = readTable(fileName);
    let maxId = 0;
    for (const row of rows){
        if(Number(row[0])>maxId){
            maxId = Number(row[0]);
        }
    }
    return maxId+1;
}
module.exports={readTable, writeTable, addRow, getNextId};