import { fetchIngredient } from "@/lib/data";


export default async function Page() {
  const ingredientsData = await fetchIngredient();
  console.log(ingredientsData);

  return <p>Ingredients</p>;
}