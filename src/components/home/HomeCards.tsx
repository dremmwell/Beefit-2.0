import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { text } from 'stream/consumers';

interface CardData {
  title: string;
  text: string
  image: string;
  link: string;
}

interface HomeCardsProps {
  cards: CardData[];
}

function HomeCards({ cards }: HomeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Link key={index} href={card.link}>
          <Card className="cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-primary hover:-translate-y-1 transition-all">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
            {card.text}
              <Image src={card.image} alt={card.title} width={200} height={150} className="w-full h-32 object-cover rounded" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default HomeCards
