
"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, GripVertical, Pencil, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExerciceData } from "@/app/types/definitions"
import { PlusCircle } from "lucide-react"
import { updateExercicePosition} from "@/app/actions/db.actions/workout.actions"
import { v4 as uuidv4 } from 'uuid';
import { Exercice, ExerciceGroup, Focus, Labels } from "@prisma/client"
import ExerciceEditDialog from "./ExerciceEditDialog"
import ExerciceDialog from "./ExerciseDialog"

const sortCardsByOrder = (cards: ExerciceGroup[]) => {
  return [...cards].sort((leftCard, rightCard) => Number(leftCard.order) - Number(rightCard.order))
}

const sortExercicesByGroupOrder = (items: ExerciceData[]) => {
  return [...items].sort((leftItem, rightItem) => Number(leftItem.groupOrder) - Number(rightItem.groupOrder))
}

const normalizeExerciceGroupOrder = (items: ExerciceData[]) => {
  const groupOrderMap = new Map<string, number>()

  return items.map((exercice) => {
    const nextGroupOrder = (groupOrderMap.get(exercice.exerciceGroupId) ?? 0) + 1
    groupOrderMap.set(exercice.exerciceGroupId, nextGroupOrder)

    if (Number(exercice.groupOrder) === nextGroupOrder) {
      return exercice
    }

    return {
      ...exercice,
      groupOrder: nextGroupOrder,
    }
  })
}

const TOP_DROP_PREFIX = "top-drop-"

const getNormalizedHexColor = (value: string) => {
  const trimmedValue = value.trim().replace("#", "")

  if (/^[0-9a-fA-F]{3}$/.test(trimmedValue)) {
    return trimmedValue
      .split("")
      .map((character) => `${character}${character}`)
      .join("")
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
    return trimmedValue
  }

  return null
}

const getReadableBadgeTextColor = (backgroundColor: string) => {
  const normalizedHexColor = getNormalizedHexColor(backgroundColor)

  if (!normalizedHexColor) {
    return "#ffffff"
  }

  const red = Number.parseInt(normalizedHexColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHexColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHexColor.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.62 ? "#111827" : "#ffffff"
}

const getExerciceLabels = (exercice: ExerciceData) => {
  return exercice.execiceLabels ?? exercice.LabelsExercice ?? []
}

type ExerciceMoveContext = {
  exerciceId: string
  startGroupId: string
  destinationGroupId: string
  startPosition: number
  destinationPosition: number
}

export default function ExerciceBoard({
    groups,
    exercicesData,
    userId 
  }: {
    groups : Array<ExerciceGroup>,
    exercicesData: Array<ExerciceData>,
    userId: string}, 
  ) {

  const [cards, setCards] = useState<ExerciceGroup[]>(() => sortCardsByOrder(groups))
  const [exercices, setExercices] = useState<ExerciceData[]>(exercicesData)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(["card-1"]))
  const [draggedItem, setDraggedItem] = useState<{ itemId: string; fromCardId: string } | null>(null)
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null)
  const [dropIndicatorItemId, setDropIndicatorItemId] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPosition, setEditPosition] = useState("")

  const [touchDragItem, setTouchDragItem] = useState<{ itemId: string; fromCardId: string } | null>(null)
  const [touchDragPosition, setTouchDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragReady, setIsDragReady] = useState(false)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const topDropRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const draggedExerciceRef = useRef<string>("")
  const dropIndicatorClearTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [activeExercice, setActiveExercice] = useState<ExerciceData | null>(null)
  const [pendingTapExerciceId, setPendingTapExerciceId] = useState<string | null>(null)

  const [activeCreationCardId, setActiveCreationCardId] = useState<string | null>(null)
  const [activeEditExercice, setActiveEditExercice] = useState<ExerciceData | null>(null)

  const setDropIndicatorDebounced = (id: string | null) => {
    if (id !== null) {
      if (dropIndicatorClearTimeoutRef.current) {
        clearTimeout(dropIndicatorClearTimeoutRef.current)
        dropIndicatorClearTimeoutRef.current = null
      }
      setDropIndicatorItemId(id)
      } else {
        dropIndicatorClearTimeoutRef.current = setTimeout(() => {
          setDropIndicatorItemId(null)
          dropIndicatorClearTimeoutRef.current = null
        }, 60)
      }
  }



  const LONG_PRESS_DURATION = 400
  const MOVE_THRESHOLD = 10

  const toggleCard = (cardId: string) => {
    if (editingCardId === cardId) return // Don't toggle while editing
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const startEditing = (e: React.MouseEvent, card: ExerciceGroup) => {
    e.stopPropagation()
    setEditingCardId(card.id)
    setEditTitle(card.name)
    setEditPosition(card.order.toString())
  }

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!editingCardId) return

    setCards((prev) => {
      const currentIndex = prev.findIndex((card) => card.id === editingCardId)
      if (currentIndex === -1) return prev

      const nextCards = [...prev]
      const [editingCard] = nextCards.splice(currentIndex, 1)

      const parsedPosition = Number.parseInt(editPosition, 10)
      const destinationIndex = Number.isNaN(parsedPosition)
        ? currentIndex
        : Math.min(Math.max(parsedPosition - 1, 0), nextCards.length)

      nextCards.splice(destinationIndex, 0, {
        ...editingCard,
        name: editTitle || editingCard.name,
      })

      const reorderedCards = nextCards.map((card, index) => ({
        ...card,
        order: index + 1,
      }))

      reorderedCards.forEach((card) => {
/*         void updateExerciceGroup(userId, card.id, card.name, card.order) */
      })

      return reorderedCards
    })

    setEditingCardId(null)
  }

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingCardId(null)
  }

  const deleteCard = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation()
/*     deleteFocus(userId, cardId) */
    setCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  const deleteItem = (cardId: string, itemId: string, userId: string) => {
    setExercices((prev) => prev.filter((exercice) => exercice.id !== itemId))
/*     deleteExercice(userId, itemId) */
  }

  const moveExercice = (
    currentExercices: ExerciceData[],
    draggedItemId: string,
    toCardId: string,
    toItemId?: string,
  ) => {
    const { nextExercices } = moveExerciceWithContext(currentExercices, draggedItemId, toCardId, toItemId)
    return nextExercices
  }

  const moveExerciceWithContext = (
    currentExercices: ExerciceData[],
    draggedItemId: string,
    toCardId: string,
    toItemId?: string,
  ): { nextExercices: ExerciceData[]; moveContext: ExerciceMoveContext | null } => {
    const draggedExercice = currentExercices.find((exercice) => exercice.id === draggedItemId)
    if (!draggedExercice) {
      return { nextExercices: currentExercices, moveContext: null }
    }

    const startGroupExercices = sortExercicesByGroupOrder(
      currentExercices.filter((exercice) => exercice.exerciceGroupId === draggedExercice.exerciceGroupId),
    )
    const startPosition = startGroupExercices.findIndex((exercice) => exercice.id === draggedItemId) + 1

    const nextExercices = currentExercices.filter((exercice) => exercice.id !== draggedItemId)
    const movedExercice: ExerciceData = {
      ...draggedExercice,
      exerciceGroupId: toCardId,
    }

    if (toItemId) {
      const targetIndex = nextExercices.findIndex((exercice) => exercice.id === toItemId)
      if (targetIndex === -1) {
        const fallbackExercices = normalizeExerciceGroupOrder([...nextExercices, movedExercice])
        const destinationPosition =
          sortExercicesByGroupOrder(fallbackExercices.filter((exercice) => exercice.exerciceGroupId === toCardId)).findIndex(
            (exercice) => exercice.id === draggedItemId,
          ) + 1

        return {
          nextExercices: fallbackExercices,
          moveContext: {
            exerciceId: draggedItemId,
            startGroupId: draggedExercice.exerciceGroupId,
            destinationGroupId: toCardId,
            startPosition,
            destinationPosition,
          },
        }
      }
      nextExercices.splice(targetIndex, 0, movedExercice)
      const normalizedExercices = normalizeExerciceGroupOrder(nextExercices)
      const destinationPosition =
        sortExercicesByGroupOrder(normalizedExercices.filter((exercice) => exercice.exerciceGroupId === toCardId)).findIndex(
          (exercice) => exercice.id === draggedItemId,
        ) + 1

      return {
        nextExercices: normalizedExercices,
        moveContext: {
          exerciceId: draggedItemId,
          startGroupId: draggedExercice.exerciceGroupId,
          destinationGroupId: toCardId,
          startPosition,
          destinationPosition,
        },
      }
    }

    let lastIndexInTargetGroup = -1
    nextExercices.forEach((exercice, index) => {
      if (exercice.exerciceGroupId === toCardId) {
        lastIndexInTargetGroup = index
      }
    })

    if (lastIndexInTargetGroup === -1) {
      nextExercices.push(movedExercice)
    } else {
      nextExercices.splice(lastIndexInTargetGroup + 1, 0, movedExercice)
    }

    const normalizedExercices = normalizeExerciceGroupOrder(nextExercices)
    const destinationPosition =
      sortExercicesByGroupOrder(normalizedExercices.filter((exercice) => exercice.exerciceGroupId === toCardId)).findIndex(
        (exercice) => exercice.id === draggedItemId,
      ) + 1

    return {
      nextExercices: normalizedExercices,
      moveContext: {
        exerciceId: draggedItemId,
        startGroupId: draggedExercice.exerciceGroupId,
        destinationGroupId: toCardId,
        startPosition,
        destinationPosition,
      },
    }
  }

  const onExerciceMoved = useCallback(
    async (
      moveContext: ExerciceMoveContext | null,
      nextExercicesSnapshot: ExerciceData[] | null,
    ) => {
      if (!moveContext || !nextExercicesSnapshot) return

      const impactedGroupIds = [moveContext.startGroupId, moveContext.destinationGroupId]
      const uniqueImpactedGroupIds = Array.from(new Set(impactedGroupIds))

      const updates = uniqueImpactedGroupIds.flatMap((groupId) => {
        const groupExercices = sortExercicesByGroupOrder(
          nextExercicesSnapshot.filter((exercice) => exercice.exerciceGroupId === groupId),
        )

        return groupExercices.map((exercice, index) => {
          return {
            exerciceId: exercice.id,
            groupOrder: index + 1,
            groupId,
          }
        })
      })

      await updateExercicePosition(userId, updates)
    },
    [userId],
  )

  const handleDragStart = (e: React.DragEvent, itemId: string, fromCardId: string) => {
    setDraggedItem({ itemId, fromCardId })
    setDropIndicatorItemId(null)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverCardId(null)
    setDropIndicatorItemId(null)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    if (dropIndicatorClearTimeoutRef.current) {
      clearTimeout(dropIndicatorClearTimeoutRef.current)
      dropIndicatorClearTimeoutRef.current = null
    }
  }

  const handleDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (dragOverCardId !== cardId) {
      setDragOverCardId(cardId)

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      if (!expandedCards.has(cardId)) {
        hoverTimeoutRef.current = setTimeout(() => {
          setExpandedCards((prev) => new Set([...prev, cardId]))
        }, 400)
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent, cardId: string) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement

    if (!currentTarget.contains(relatedTarget)) {
      if (dragOverCardId === cardId) {
        setDragOverCardId(null)
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }
  }

  const handleDrop = (e: React.DragEvent, toCardId: string) => {
    e.preventDefault()

    if (!draggedItem) {
      setDraggedItem(null)
      setDragOverCardId(null)
      setDropIndicatorItemId(null)
      return
    }

    const moveResult = moveExerciceWithContext(exercices, draggedItem.itemId, toCardId)
    setExercices(moveResult.nextExercices)
    void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)
    // TODO: Persist moving exercice between groups
/*     moveExerciceToGroup(moveContext) */

    setDraggedItem(null)
    setDragOverCardId(null)
    setDropIndicatorItemId(null)
  }

  const handleDropOnItem = (e: React.DragEvent, toCardId: string, toItemId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem || draggedItem.itemId === toItemId) {
      setDropIndicatorItemId(null)
      return
    }

    const moveResult = moveExerciceWithContext(exercices, draggedItem.itemId, toCardId, toItemId)
    setExercices(moveResult.nextExercices)
    void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)

    // TODO: Persist reorder/move for dropped exercice
/*     if (moveContext) moveExerciceToGroup(moveContext) */

    setDraggedItem(null)
    setDragOverCardId(null)
    setDropIndicatorItemId(null)
  }

  const handleDropOnTop = (e: React.DragEvent, toCardId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem) {
      setDropIndicatorItemId(null)
      return
    }

    const firstInGroup = exercices.find((exercice) => exercice.exerciceGroupId === toCardId)
    const moveResult = firstInGroup && firstInGroup.id !== draggedItem.itemId
      ? moveExerciceWithContext(exercices, draggedItem.itemId, toCardId, firstInGroup.id)
      : moveExerciceWithContext(exercices, draggedItem.itemId, toCardId)

    setExercices(moveResult.nextExercices)
    void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)

    // TODO: Persist reorder/move for dropped exercice at top
/*     if (moveContext) moveExerciceToGroup(moveContext) */

    setDraggedItem(null)
    setDragOverCardId(null)
    setDropIndicatorItemId(null)
  }

  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  const getCardUnderTouch = useCallback((x: number, y: number): string | null => {
    for (const [cardId, element] of cardRefs.current) {
      const rect = element.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return cardId
      }
    }
    return null
  }, [])

  const getItemUnderTouch = useCallback((x: number, y: number): string | null => {
    for (const [itemId, element] of itemRefs.current) {
      const rect = element.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return itemId
      }
    }
    return null
  }, [])

  const getTopDropCardUnderTouch = useCallback((x: number, y: number): string | null => {
    for (const [cardId, element] of topDropRefs.current) {
      const rect = element.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return cardId
      }
    }
    return null
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent, itemId: string, fromCardId: string, exerciceName: string) => {
    const touch = e.touches[0]
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
    draggedExerciceRef.current = exerciceName

    longPressTimeoutRef.current = setTimeout(() => {
      setIsDragReady(true)
      setTouchDragItem({ itemId, fromCardId })
      setDropIndicatorItemId(null)
      setTouchDragPosition({ x: touch.clientX, y: touch.clientY })
      if (navigator.vibrate) navigator.vibrate(50)
    }, LONG_PRESS_DURATION)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]

      if (!isDragReady && touchStartPosRef.current) {
        const dx = Math.abs(touch.clientX - touchStartPosRef.current.x)
        const dy = Math.abs(touch.clientY - touchStartPosRef.current.y)
        if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
          if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current)
            longPressTimeoutRef.current = null
          }
          return
        }
      }

      if (!touchDragItem || !isDragReady) return

      if (e.cancelable) {
        e.preventDefault()
      }
      setTouchDragPosition({ x: touch.clientX, y: touch.clientY })

      const itemUnder = getItemUnderTouch(touch.clientX, touch.clientY)
      const topDropCardUnder = getTopDropCardUnderTouch(touch.clientX, touch.clientY)
      const cardUnder = getCardUnderTouch(touch.clientX, touch.clientY)
      setDropIndicatorItemId(topDropCardUnder ? `${TOP_DROP_PREFIX}${topDropCardUnder}` : itemUnder)

      if (cardUnder !== dragOverCardId) {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)

        setDragOverCardId(cardUnder)

        if (cardUnder && !expandedCards.has(cardUnder)) {
          hoverTimeoutRef.current = setTimeout(() => {
            setExpandedCards((prev) => new Set([...prev, cardUnder]))
          }, 400)
        }
      }
    },
    [touchDragItem, isDragReady, dragOverCardId, expandedCards, getCardUnderTouch, getItemUnderTouch, getTopDropCardUnderTouch],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }

      if (!touchDragItem || !isDragReady) {
        setIsDragReady(false)
        setTouchDragItem(null)
        setTouchDragPosition(null)
        touchStartPosRef.current = null
        return
      }

      const touch = e.changedTouches[0]
      const targetItemId = getItemUnderTouch(touch.clientX, touch.clientY)
      const targetTopCardId = getTopDropCardUnderTouch(touch.clientX, touch.clientY)
      const targetCardId = getCardUnderTouch(touch.clientX, touch.clientY)

      if (targetItemId && targetItemId !== touchDragItem.itemId) {
        const targetExercice = exercices.find((exercice) => exercice.id === targetItemId)
        if (targetExercice) {
          const moveResult = moveExerciceWithContext(exercices, touchDragItem.itemId, targetExercice.exerciceGroupId, targetItemId)
          setExercices(moveResult.nextExercices)
          void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)
        }
        // TODO: Persist reorder/move for dropped exercice on touch
/*         if (moveContext) moveExerciceToGroup(moveContext) */
      } else if (targetTopCardId) {
        const firstInGroup = exercices.find((exercice) => exercice.exerciceGroupId === targetTopCardId)
        const moveResult = firstInGroup && firstInGroup.id !== touchDragItem.itemId
          ? moveExerciceWithContext(exercices, touchDragItem.itemId, targetTopCardId, firstInGroup.id)
          : moveExerciceWithContext(exercices, touchDragItem.itemId, targetTopCardId)

        setExercices(moveResult.nextExercices)
        void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)
        // TODO: Persist moving/reordering exercice at top on touch
/*         if (moveContext) moveExerciceToGroup(moveContext) */
      } else if (targetCardId && targetCardId !== touchDragItem.fromCardId) {
        const moveResult = moveExerciceWithContext(exercices, touchDragItem.itemId, targetCardId)
        setExercices(moveResult.nextExercices)
        void onExerciceMoved(moveResult.moveContext, moveResult.nextExercices)
        // TODO: Persist moving exercice between groups on touch
/*         if (moveContext) moveExerciceToGroup(moveContext) */
      }

      setTouchDragItem(null)
      setTouchDragPosition(null)
      setDragOverCardId(null)
      setDropIndicatorItemId(null)
      setIsDragReady(false)
      touchStartPosRef.current = null

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    },
    [touchDragItem, isDragReady, exercices, getCardUnderTouch, getItemUnderTouch, getTopDropCardUnderTouch, onExerciceMoved],
  )

  const handleTouchCancel = useCallback(() => {
    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current)
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setTouchDragItem(null)
    setTouchDragPosition(null)
    setDragOverCardId(null)
    setDropIndicatorItemId(null)
    setIsDragReady(false)
    touchStartPosRef.current = null
  }, [])

  const addNewCard = () => {
    const newOrder = Math.max(...cards.map(c => c.order), 0) + 1
    const newCard: ExerciceGroup = {
      id: uuidv4(),
      name: "New Group",
      order: newOrder,
      userId: userId,
      createdAt: new Date(),
    }
/*     createExerciceGroup(userId, newCard) */
    setCards((prev) => sortCardsByOrder([...prev, newCard]))
    setExpandedCards((prev) => new Set([...prev, newCard.id]))
  }

  const createExercice = (exercice: Exercice) => {
    if (!activeCreationCardId) return
    // TODO: Create new exercice in active group
/*     createExerciceInGroup(userId, activeCreationCardId, exercice) */
    setActiveCreationCardId(null)
  }

  const saveEditedExercice = ( updatedExercice: Exercice) => {
    if (!activeEditExercice) return
    // TODO: Update exercice name/details
/*     updateExercice(userId, activeEditExercice.id, updatedExercice) */
    setActiveEditExercice(null)
  }
  
  const saveExerciseToWorkout = (exercice: ExerciceData) => {
    console.log("Saving exercice to workout:", exercice)
  }

  const handleExerciceCardClick = (exercice: ExerciceData) => {
    const isMobileTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches

    if (isMobileTouch && pendingTapExerciceId !== exercice.id) {
      setPendingTapExerciceId(exercice.id)
      return
    }

    setPendingTapExerciceId(null)
    setActiveExercice(exercice)
  }

  return (
    <div className="flex flex-col lg:gap-4 gap-2 lg:flex-row overflow-y-scroll lg:overflow-y-visible lg:overflow-x-auto pb-4 no-scrollbar lg:flex-wrap">
        {cards && cards.map((card) => {
        const isExpanded = expandedCards.has(card.id)
        const isDragOver = dragOverCardId === card.id
        const isEditing = editingCardId === card.id
        const groupExercices = sortExercicesByGroupOrder(exercices.filter((exercice) => exercice.exerciceGroupId === card.id))
        return (
          <Card
            key={card.id}
            ref={(el) => {
              if (el) cardRefs.current.set(card.id, el)
              else cardRefs.current.delete(card.id)
            }}
            className={cn("transition-all duration-200 flex-1 min-w-60 lg:max-w-80 group py-1 bg-background", isDragOver && "border-primary")}
            onDragOver={(e) => handleDragOver(e, card.id)}
            onDragLeave={(e) => handleDragLeave(e, card.id)}
            onDrop={(e) => handleDrop(e, card.id)}
          >
            <CardHeader className="cursor-pointer select-none py-3 lg:cursor-default" onClick={(e) => {
              if (window.innerWidth >= 1024) return; // Don't toggle on lg screens
              toggleCard(card.id);
            }}>
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex flex-col gap-3 flex-1" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-1">
                      <div className="flex">
                        <Label htmlFor={`title-${card.id}`} className="text-xs text-muted-foreground">
                          Exercice Group
                        </Label>
                        <Button size="icon" variant="ghost" className="h-6 w-6 -mt-1 -mr-2 ml-auto" onClick={cancelEdit}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <Input
                        id={`title-${card.id}`}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-9"
                        placeholder="Group name"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`position-${card.id}`} className="text-xs text-muted-foreground">
                        Position
                      </Label>
                      <Select value={editPosition} onValueChange={setEditPosition}>
                        <SelectTrigger id={`position-${card.id}`} className="h-9 w-full">
                          <SelectValue placeholder={(card.order + 1).toString()} />
                        </SelectTrigger>
                        <SelectContent>
                          {cards.map((_, index) => {
                            const position = (index + 1).toString()
                            return (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" className="w-full mt-1" onClick={saveEdit}>
                      Save changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-base flex items-center gap-2">
                      {card.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => startEditing(e, card)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 group/delete"
                        onClick={(e) => deleteCard(e, card.id)}
                        disabled={exercices.filter((ex) => ex.exerciceGroupId === card.id).length > 0}
                      >
                        <Trash2
                          className={cn(
                            "h-4 w-4 transition-colors text-muted-foreground group-hover/delete:text-red-500",
                          )}
                        />
                      </Button>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-200 lg:hidden",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardHeader>

            <div className={cn("grid transition-all duration-200 lg:grid-rows-[1fr]", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <CardContent>
                  {groupExercices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                      No exercices in this group
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      <li
                        ref={(el) => {
                          if (el) topDropRefs.current.set(card.id, el)
                          else topDropRefs.current.delete(card.id)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          e.dataTransfer.dropEffect = "move"
                          setDropIndicatorDebounced(`${TOP_DROP_PREFIX}${card.id}`)
                        }}
                        onDragLeave={(e) => {
                          const relatedTarget = e.relatedTarget as Node | null
                          if (!e.currentTarget.contains(relatedTarget)) {
                            setDropIndicatorDebounced(null)
                          }
                        }}
                        onDrop={(e) => handleDropOnTop(e, card.id)}
                        className={cn(
                          "h-2 rounded-md border transition-colors",
                          dropIndicatorItemId === `${TOP_DROP_PREFIX}${card.id}`
                            ? "bg-primary/20 border-primary/30"
                            : "bg-transparent border-transparent",
                        )}
                      />
                      {groupExercices.flatMap((exercice) => {
                        const currentDraggedItemId = draggedItem?.itemId ?? touchDragItem?.itemId
                        const showDropIndicator =
                          dropIndicatorItemId === exercice.id && currentDraggedItemId !== exercice.id
                        const exerciceLabels = getExerciceLabels(exercice)

                        return [
                          showDropIndicator ? (
                            <li
                              key={`drop-indicator-${exercice.id}`}
                              className="h-2 rounded-md bg-primary/20 border border-primary/30"
                            />
                          ) : null,
                          <li
                            key={exercice.id}
                            ref={(el) => {
                              if (el) itemRefs.current.set(exercice.id, el)
                              else itemRefs.current.delete(exercice.id)
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, exercice.id, card.id)}
                            onDragOver={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              e.dataTransfer.dropEffect = "move"
                              setDropIndicatorDebounced(exercice.id)
                            }}
                            onDragLeave={(e) => {
                              const relatedTarget = e.relatedTarget as Node | null
                              if (!e.currentTarget.contains(relatedTarget)) {
                                setDropIndicatorDebounced(null)
                              }
                            }}
                            onDrop={(e) => handleDropOnItem(e, card.id, exercice.id)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => handleTouchStart(e, exercice.id, card.id, exercice.name)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchCancel}
                            onClick={() => handleExerciceCardClick(exercice)}
                            className={cn(
                              "group/labelitem flex items-start gap-2 lg:p-3 p-2 bg-card border rounded-lg active:cursor-grabbing cursor-pointer transition-all duration-200 touch-none",
                              (draggedItem?.itemId === exercice.id || touchDragItem?.itemId === exercice.id) && "opacity-50",
                            )}
                          >
                            <GripVertical className="cursor-move mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-row">
                                <span className="block text-sm truncate">{exercice.name}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="ml-auto h-6 w-6 shrink-0 opacity-0 pointer-events-none transition-opacity group-hover/labelitem:opacity-100 group-hover/labelitem:pointer-events-auto group-focus-within/labelitem:opacity-100 group-focus-within/labelitem:pointer-events-auto"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveEditExercice(exercice)
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                </Button>
                              </div>
                              {exerciceLabels.length > 0 ? (
                                <div className="mt-1 max-h-8 overflow-hidden opacity-100 transition-all duration-600 ease-out group-hover/labelitem:mt-2 group-hover/labelitem:max-h-32 group-focus-within/labelitem:mt-2 group-focus-within/labelitem:max-h-32">
                                  <div className="flex w-full flex-row flex-wrap content-start items-center gap-1">
                                    {exerciceLabels.map((exerciceLabel) => {
                                      const label = exerciceLabel.Labels ?? exerciceLabel.labels

                                      if (!label) {
                                        return null
                                      }

                                      return (
                                        <Badge
                                          key={exerciceLabel.id}
                                          variant="outline"
                                          className="h-3 min-w-7 max-w-7 grow-0 shrink-0 basis-auto justify-center overflow-hidden rounded-full border-transparent px-1 shadow-sm transition-all duration-200 ease-out group-hover/labelitem:h-6 group-hover/labelitem:max-w-32 group-hover/labelitem:px-2.5 group-focus-within/labelitem:h-6 group-focus-within/labelitem:max-w-32 group-focus-within/labelitem:px-2.5"
                                          style={{
                                            backgroundColor: label.color,
                                            color: getReadableBadgeTextColor(label.color),
                                          }}
                                          title={label.name}
                                        >
                                          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-600 ease-out group-hover/labelitem:max-w-24 group-hover/labelitem:opacity-100 group-focus-within/labelitem:max-w-24 group-focus-within/labelitem:opacity-100">
                                            {label.name}
                                          </span>
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </li>,
                        ]
                      })}
                    </ul>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2"
                    onClick={() => setActiveCreationCardId(card.id)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Exercice
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
        )
      })}
          <Button onClick={addNewCard} variant="outline" className="h-fit p-3 border-dashed text-muted-foreground shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
            Add Group
          </Button>


      {touchDragItem && touchDragPosition && isDragReady && (
        <div
          className="fixed pointer-events-none z-50 flex items-center gap-2 p-3 bg-secondary rounded-lg shadow-lg border"
          style={{
            left: touchDragPosition.x,
            top: touchDragPosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm">{draggedExerciceRef.current}</span>
        </div>
      )}


      {activeExercice && (
        <ExerciceDialog
          open={!!activeExercice}
          onOpenChange={(open) => {
            if (!open) setActiveExercice(null)
            if (!open) setPendingTapExerciceId(null)
          }}
          onSave={saveExerciseToWorkout}
          exercice={activeExercice}
        />
      )}

      {activeEditExercice && (
        <ExerciceEditDialog
          open={!!activeEditExercice}
          onOpenChange={(open) => {
            if (!open) setActiveEditExercice(null)
          }}
          onSave={saveEditedExercice}
          exercice={activeEditExercice}
        />
      )}
    </div>
  )
}
