import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MealValues } from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import CaloriesChart from "../today/CaloriesChart";
import MacroChart from "../today/MacroChart";


export default function DayChartsCards({ values, objective, date} : { values : MealValues, objective : Objective, date : Date}) {
    return(
        <Card className="overflow-scroll no-scrollbar xl:min-w-80 flex-1">
            <CardContent className="flex lg:flex-row flex-col lg:gap-6 lg:mx-6 pt-4 pb-2 lg:pb-4">
                <div className="flex flex-col lg:gap-4 pb-2 md:text-center font-semibold">
                    {date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}
                    <CaloriesChart values={values} objective={objective}/>
                </div>
                <div className="flex-1 lg:mx-6 lg:mt-6">
                    <MacroChart values={values} objective={objective}/>
                </div>
            </CardContent>
        </Card>
    )
}