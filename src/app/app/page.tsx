import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import HomeCards from "@/components/home/HomeCards";
import todayImage from "@/rsrc/home/today.png"
import recipeImage from "@/rsrc/home/recipes.png"
import ingredientImage from "@/rsrc/home/ingredients.png"
import objectiveImage from "@/rsrc/home/objectives.png"
import overviewImage from "@/rsrc/home/overview.png"  


const homeCardsData = [
    {
    title: "Today",
    text: "Get an overview of your daily nutrition and fitness stats at a glance.",
    image: todayImage,
    link: "/app/today"
  },
  {
    title: "Recipes",
    text: "Browse and manage your collection of delicious recipes tailored to your dietary goals.",
    image: recipeImage,
    link: "/app/recipes"
  },
  {
    title: "Ingredients",
    text: "Explore and organize your ingredients for better meal planning and cooking.",
    image: ingredientImage,
    link: "/app/ingredients"
  },
  {
    title: "Objectives",
    text: "Set and monitor your fitness and nutrition objectives to achieve your health goals.",
    image: objectiveImage,
    link: "/app/objectives"
  },
  {
    title: "Overview",
    text: "View comprehensive reports and analytics on your progress over time.",
    image: overviewImage,
    link: "/app/overview"
  }
];

export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  return (
    <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Welcome {user.username} !</h1>
        <div className="flex flex-col gap-3 overflow-y-scroll no-scrollbar py-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {homeCardsData.map((card) => (
            <HomeCards
              key={card.title}
              title={card.title}
              text={card.text}
              image={card.image}
              link={card.link}
            />
          ))}
        </div>
    </main>
  );
}
