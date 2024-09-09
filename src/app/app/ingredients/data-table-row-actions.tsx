'use client';

import { useState } from 'react';

import IconMenu from '@/components/icon-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2,ListCollapse } from 'lucide-react';
import DeleteDialog from './DeleteDialog';
import { Ingredient } from '@prisma/client';
import { EditFormDialog } from './EditFormDialog';
import DetailsDialog from './DetailsDialog';

interface CommonIngredient {
        id: string;
        name: string;
        unit: string;
        gramsPerUnit: number;
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        userId: string;
        bookmarked: boolean;
        createdAt: Date;
        updatedAt: Date;
}
interface DataTableRowActionsProps<TData extends Ingredient> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends CommonIngredient>({
  row
}: 
DataTableRowActionsProps<TData>) {

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
{/*       <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Person"
      >
        <EditForm ingredientId={ingredientId} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>
 */}

{/* Handles Dialogs open/close and props setup */} 
      <DeleteDialog 
        ingredient={row.original}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />

{/*       <EditFormDialog
        ingredient={row.original}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      /> */}

      <DetailsDialog 
        ingredient={row.original}
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
      />

      <DropdownMenu> 
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                <button
                onClick={() => {
                    setIsDetailsOpen(true);
                }}
                className="w-full justify-start flex rounded-md p-2"
                >
                <IconMenu
                    text="Details"
                    icon={<ListCollapse className="h-4 w-4" />}
                />
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                <button
                onClick={() => {
                    setIsEditOpen(true);
                }}
                className="w-full justify-start flex rounded-md p-2"
                >
                <IconMenu
                    text="Edit"
                    icon={<SquarePen className="h-4 w-4" />}
                />
                </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 focus:bg-destructive">
                <button
                onClick={() => {
                    setIsDeleteOpen(true);
                }}
                className="w-full justify-start flex rounded-md p-2"
                >
                <IconMenu
                    text="Delete"
                    icon={<Trash2 className="h-4 w-4" />}
                />
                </button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}