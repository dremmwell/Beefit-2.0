import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MealValues } from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import DayCaloriesChart from "./DayCaloriesChart";
import DayMacroChart from "./DayMacroChart";


export default function DayChartsCards({ values, objective, date} : { values : MealValues, objective : Objective, date : Date}) {
    return(
        <Card className="overflow-scroll no-scrollbar xl:min-w-80 flex-1">
            <CardHeader className="pt-4 pb-2">
                {date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}
            </CardHeader>
            <CardContent className="flex gap-4 pb-2">
                    <DayCaloriesChart values={values} objective={objective}/>
                <div className="flex-1 lg:mx-6 lg:mt-6">
                    <DayMacroChart values={values} objective={objective}/>
                </div>
            </CardContent>
        </Card>
    )
}