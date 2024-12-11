import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MealValues } from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import CaloriesChart from "./CaloriesChart";
import MacroChart from "./MacroChart";


export default function ChartsCards({ values, objective, date} : { values : MealValues, objective : Objective, date : Date}) {
    return(
        <Card className="overflow-scroll no-scrollbar xl:min-w-80 min-h-56">
            <CardHeader className="pb-2 md:text-center display hidden md:block font-semibold">
                {date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}
            </CardHeader>
            <CardContent className="flex flex-col pb-2 md:pb-6 md:gap-6 mt-4 mb:mt-2">
                <CaloriesChart values={values} objective={objective}/>
                <MacroChart values={values} objective={objective}/>
            </CardContent>
        </Card>
    )
}