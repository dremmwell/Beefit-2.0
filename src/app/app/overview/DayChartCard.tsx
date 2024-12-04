import { MealValues } from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import CaloriesChart from "../today/CaloriesChart";
import MacroChart from "../today/MacroChart";


export default function DayChartsCards({ values, objective, date} : { values : MealValues, objective : Objective, date : Date}) {
    return(
        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-scroll no-scrollbar xl:min-w-80 pt-4 px-6">
            <div className="flex lg:flex-row flex-col md:gap-6 lg:mx-6">
                <div className="flex flex-col my-4 gap-4 pb-2 md:text-center font-semibold">
                    {date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}
                    <CaloriesChart values={values} objective={objective}/>
                </div>
                <div className="flex-1 lg:mx-6 mt-6">
                    <MacroChart values={values} objective={objective}/>
                </div>
            </div>
        </div>
    )
}