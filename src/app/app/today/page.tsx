import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import MacroChart from "./MacroChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import Timeline from "./TimeLine";
import CaloriesChart from "./CaloriesChart";
import { Button } from "@/components/ui/button";
import { AddMealDialog } from "./AddMealDialog";
import { RecipeAndIngredients } from "@/app/types/definitions";
import { Ingredient, Meal } from "@prisma/client";
import { getRecipesAndIngredients, getIngredients, getMealsByDate} from "@/app/actions/db.actions";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const recipes :Array<RecipeAndIngredients>= await getRecipesAndIngredients(user.id);
  const ingredients :Array<Ingredient> = await getIngredients(user.id);
  const today = new Date();
  const todaysMeals : Array<Meal> = await getMealsByDate(user.id,today);

  console.log(todaysMeals)


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
  ]
  
  return (
    <div className="container sm:my-10 my-5 md:grid md:grid-cols-[auto_auto] md:grid-rows-[auto-auto-auto] flex flex-col gap-4 max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2 col-span-2">Today</h1>
        <div className="flex md:flex-col gap-4 row-span-2 row-start-2">
          <CaloriesChart />
{/*           <MacroChart /> */}
        </div>
        <div className='flex row-start-2 items-center justify-between'>
          <h3 className='font-semibold leading-none tracking-tight pt-2 px-2'>Meal Diary - <span className='text-sm text-muted-foreground font-normal'>02 October 2024</span></h3>
          <AddMealDialog recipes={recipes} ingredients={ingredients}/>
        </div>
        <>
          <ScrollArea className="rounded-xl border col-start-2 row-start-3 p-4">
              <Timeline items={timelineItems}/>
          </ScrollArea>
        </>
    </div>
  )
}