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
        <Card>
            <CardHeader className="display md:hidden p-4 pb-0">
                <p className="display">{date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</p>
            </CardHeader>
            <CardContent className="flex gap-6 p-4 justify-between">
                <div className="flex flex-col md:pt-4 pb-2 gap-4">
                    <p className="display hidden md:block">{date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</p>
                    <DayCaloriesChart values={values} objective={objective}/>
                </div>
                <div className="md:mx-6 mt-4">
                    <DayMacroChart values={values} objective={objective}/>
                </div>
            </CardContent>
        </Card>
    )
}