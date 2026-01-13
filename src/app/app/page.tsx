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
  title: "Ingredients",
  text: "Add your favorite ingredients with their nutritional information and custom measures to your personnal list.",
  image: ingredientImage,
  link: "/app/ingredients",
  footer: "Add ingredients"
  },
  {
  title: "Recipes",
  text: "Create amazing recipes by combining your ingredients and track their nutritional values easily.",
  image: recipeImage,
  link: "/app/recipes",
  footer: "Create recipes"
  },
  {
  title: "Objectives",
  text: "Set you caloric and macronutrients goals according to your fitness objectives.",
  image: objectiveImage,
  link: "/app/objectives",
  footer: "Set objectives"
  },
  {
  title: "Today",
  text: "Track your meals throughout the day and monitor your progress towards your daily goals.",
  image: todayImage,
  link: "/app/today",
  footer: "Daily Tracking"
  },
  {
  title: "Overview",
  text: "Get a comprehensive overview of your weekly progress, amend your goals and stay motivated.",
  image: overviewImage,
  link: "/app/overview",
  footer: "Review progress"
  },
  {
  title: "Workouts",
  text: "Plan and track your workouts to complement your nutrition and optimise your fitness goals.",
  image: recipeImage,
  link: "/app/workouts",
  footer: "Track workouts"
  }
];

export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  return (
    <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <div className="border-b text-3xl font-semibold tracking-tight first:mt-0">Welcome {user.username},  <div className="text-xl ml-auto">Lets start step by step with your fitness journey !</div></div>
        <div className="flex flex-col gap-3 overflow-y-scroll no-scrollbar py-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {homeCardsData.map((card) => (
            <HomeCards
              key={card.title}
              title={card.title}
              text={card.text}
              image={card.image}
              link={card.link}
              footer={card.footer}
            />
          ))}
        </div>
    </main>
  );
}
