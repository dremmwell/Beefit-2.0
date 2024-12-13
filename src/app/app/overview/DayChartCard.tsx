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
            <CardContent className="flex lg:pt-6 gap-6 p-4 lg:p-6">
                <DayCaloriesChart values={values} objective={objective}/>
                <DayMacroChart values={values} objective={objective}/>
            </CardContent>
        </Card>
    )
}