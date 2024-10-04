import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import DayInfoCard from "./DayInfoCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import DayTimeline from "./DayTimeLine";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const timelineItems = [
    {
      title: "Snack",
      calories: "300",
      description: "QuInteger eu lorem pretium, sollicitudin nisi et, luctus magna.",
    },

    {
      title: "Diner",
      calories: "1050",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae, consectetur placerat enim. Maecenas ornare mi nec orci blandit, at sagittis nibh ultricies. In ultrices tellus leo, sit amet sodales sem dignissim sit amet.",
    },
    {
      title: "Snack",
      calories: "410",
      description: "Suspendisse interdum lectus maximus, ullamcorper felis feugiat, mollis tortor.",
    },
    {
      title: "Lunch",
      calories: "850",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae,",
    },
    {
      title: "Snack",
      calories: "300",
      description: "QuInteger eu lorem pretium, sollicitudin nisi et, luctus magna.",
    },
    {
      title: "Breakfast",
      calories: "1205",
      description: "Nulla gravida maximus nunc mollis luctus. Donec eu enim purus. Quisque tempor, lacus sit amet feugiat maximus, ante ex scelerisque elit, et lacinia ipsum dolor vitae ligula.",
    },
  ]
  
  return (
    <div className="container sm:my-10 my-5 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Today</h1>
      <DayInfoCard /> 
      <ScrollArea className="rounded-xl border">
          <DayTimeline items={timelineItems}/>
      </ScrollArea>
    </div>
  )
}