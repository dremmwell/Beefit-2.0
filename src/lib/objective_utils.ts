import { Objective } from "@prisma/client";

export function getDayObjective(objectives : Objective[], date : Date){

    let dateNext = new Date(date)
    dateNext.setDate(dateNext.getDate() + 1);
    const dateTime = dateNext.getTime()

    // Find the existing objectives before the date
    const objectivesBeforeDate = objectives.filter(
        obj => {var objDate = new Date(obj.createdAt).getTime();
        return (objDate < dateTime)
    });
    if(objectivesBeforeDate.length === 0){
        // Find the first objective of the whole list
        const firstObjective = objectives.reduce((latest, current) => {
            var currentDate = new Date(current.createdAt).getTime();
            var latestDate = new Date(latest.createdAt).getTime();
        return currentDate > latestDate ? current : latest
        });
        return firstObjective
    }
    else{
        // Find the first objective of the filtered list
        const firstObjective = objectivesBeforeDate.reduce((latest, current) => {
            var currentDate = new Date(current.createdAt).getTime();
            var latestDate = new Date(latest.createdAt).getTime();
        return currentDate > latestDate ? current : latest
        });
        return firstObjective
    }
}