import { MealValues } from '@/app/types/definitions';
import { Objective } from '@prisma/client';
import React from 'react';
import { sumMealValues } from '@/lib/meal_utils';

interface DayInfoProps {
  date: Date;
  values :MealValues[];
  objective : Objective
}

export default function DayInfo ({ date, values, objective } : DayInfoProps) {

  const sumValues : MealValues = sumMealValues(values);

  return (
    <div>
      <p>{date.toDateString()}</p>
      <p>{objective?.calories}</p>
      <p>{sumValues?.calories}</p>
    </div>
  );
};
