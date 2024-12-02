import { ObjectiveAndDate } from "@/app/types/definitions";
import { Objective } from "@prisma/client";

export function setObjectiveForEachDay(lastestObjective : Objective, objectives : Objective[], startDate : Date, endDate : Date, ){
    
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Both startDate and endDate must be valid Date objects.');
    }
    if (startDate > endDate) {
        throw new Error('startDate must be earlier than or equal to endDate.');
    }

    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const dateAndOjectives : ObjectiveAndDate[] = [];
    const lastestObjectiveDate : Date = new Date(lastestObjective.createdAt)
   
    dates.forEach((date : Date) => {
            if(date > lastestObjectiveDate){
                const dateAndOjective : ObjectiveAndDate = {objective : lastestObjective, date : date}
                dateAndOjectives.push(dateAndOjective);
            }
            else{
                for(let i = 0; i < objectives.length; i++){
                    const objectiveDate : Date = new Date(objectives[i].createdAt)

                    const checkDate = new Date(date)
                    checkDate.setDate(date.getDate() + 1)
/*                     console.log(date, checkDate) */

                    if(checkDate > objectiveDate) {
                        const dateAndOjective : ObjectiveAndDate = { objective : objectives[i], date : date}
                        dateAndOjectives.push(dateAndOjective)
                        break
                    }
                }
            }
    })
    console.log(dateAndOjectives)
    return dateAndOjectives
  }