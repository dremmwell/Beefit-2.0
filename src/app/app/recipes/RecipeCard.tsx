import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Recipe } from '@prisma/client'


interface RecipeCardProps {
    recipe: Recipe,
}

export default function RecipeCard({recipe}: RecipeCardProps) {

  return (
    <Card key={recipe.id}>
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
