function toNumber(text){
    const parts = text.split("-");
    const month = Number(parts[0]);
    const day = Number(parts[1]);
    const year= Number(parts[2]);
    return year*10000 + month *100+day;
}

function endToNumber(text){
    if(text===""){
        return 99999999;
    }
    return toNumber(text);
}

function isValidDate(text){
    if(!/^\d{2}-\d{2}-\d{4}$/.test(text)){
        return false;
    }
    const parts = text.split("-");
    const month = Number(parts[0]);
    const day = Number (parts[1]);
    const year = Number (parts[2]);

    const d = new Date(year, month-1 , day);
    return d.getFullYear()=== year && d.getMonth()=== month-1 && d.getDate()===day;
}

function isOverlapping(startA , endA , startB , endB){
    return toNumber(startA)<= endToNumber(endB) && toNumber(startB)<= endToNumber(endA);
}
module.exports={toNumber,endToNumber,isValidDate,isOverlapping};