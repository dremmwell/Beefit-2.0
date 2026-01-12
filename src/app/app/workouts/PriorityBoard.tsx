"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, GripVertical, Pencil, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Item {
  id: string
  label: string
}

interface CardData {
  id: string
  title: string
  priority: number
  items: Item[]
}

const initialData: CardData[] = [
  {
    id: "card-1",
    title: "Priority",
    priority: 12,
    items: [
      { id: "item-1", label: "Research competitors" },
      { id: "item-2", label: "Create wireframes" },
      { id: "item-3", label: "Write documentation" },
    ],
  },
  {
    id: "card-2",
    title: "Moderate",
    priority: 6,
    items: [
      { id: "item-4", label: "Build prototype" },
      { id: "item-5", label: "Design system setup" },
    ],
  },
  {
    id: "card-3",
    title: "Maintenance",
    priority: 2,
    items: [
      { id: "item-6", label: "Initial planning" },
      { id: "item-7", label: "Team kickoff" },
    ],
  },
]

export default function PriorityBoard() {
  const [cards, setCards] = useState<CardData[]>(initialData)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(["card-1"]))
  const [draggedItem, setDraggedItem] = useState<{ itemId: string; fromCardId: string } | null>(null)
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPriority, setEditPriority] = useState("")

  const [touchDragItem, setTouchDragItem] = useState<{ itemId: string; fromCardId: string } | null>(null)
  const [touchDragPosition, setTouchDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragReady, setIsDragReady] = useState(false)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const draggedLabelRef = useRef<string>("")

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

  const startEditing = (e: React.MouseEvent, card: CardData) => {
    e.stopPropagation()
    setEditingCardId(card.id)
    setEditTitle(card.title)
    setEditPriority(card.priority.toString())
  }

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!editingCardId) return

    setCards((prev) =>
      prev.map((card) =>
        card.id === editingCardId
          ? { ...card, title: editTitle || card.title, priority: Number.parseInt(editPriority) || card.priority }
          : card,
      ),
    )
    setEditingCardId(null)
  }

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingCardId(null)
  }

  const deleteCard = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation()
    setCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  const deleteItem = (cardId: string, itemId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, items: card.items.filter((item) => item.id !== itemId) } : card,
      ),
    )
  }

  const handleDragStart = (e: React.DragEvent, itemId: string, fromCardId: string) => {
    setDraggedItem({ itemId, fromCardId })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverCardId(null)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
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

    if (!draggedItem || draggedItem.fromCardId === toCardId) {
      setDraggedItem(null)
      setDragOverCardId(null)
      return
    }

    setCards((prevCards) => {
      const newCards = prevCards.map((card) => ({ ...card, items: [...card.items] }))

      const fromCard = newCards.find((c) => c.id === draggedItem.fromCardId)
      const toCard = newCards.find((c) => c.id === toCardId)

      if (!fromCard || !toCard) return prevCards

      const itemIndex = fromCard.items.findIndex((item) => item.id === draggedItem.itemId)
      if (itemIndex === -1) return prevCards

      const [movedItem] = fromCard.items.splice(itemIndex, 1)
      toCard.items.push(movedItem)

      return newCards
    })

    setDraggedItem(null)
    setDragOverCardId(null)
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

  const handleTouchStart = useCallback((e: React.TouchEvent, itemId: string, fromCardId: string, label: string) => {
    const touch = e.touches[0]
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
    draggedLabelRef.current = label

    longPressTimeoutRef.current = setTimeout(() => {
      setIsDragReady(true)
      setTouchDragItem({ itemId, fromCardId })
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

      e.preventDefault()
      setTouchDragPosition({ x: touch.clientX, y: touch.clientY })

      const cardUnder = getCardUnderTouch(touch.clientX, touch.clientY)

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
    [touchDragItem, isDragReady, dragOverCardId, expandedCards, getCardUnderTouch],
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
      const targetCardId = getCardUnderTouch(touch.clientX, touch.clientY)

      if (targetCardId && targetCardId !== touchDragItem.fromCardId) {
        setCards((prevCards) => {
          const newCards = prevCards.map((card) => ({ ...card, items: [...card.items] }))
          const fromCard = newCards.find((c) => c.id === touchDragItem.fromCardId)
          const toCard = newCards.find((c) => c.id === targetCardId)

          if (!fromCard || !toCard) return prevCards

          const itemIndex = fromCard.items.findIndex((item) => item.id === touchDragItem.itemId)
          if (itemIndex === -1) return prevCards

          const [movedItem] = fromCard.items.splice(itemIndex, 1)
          toCard.items.push(movedItem)

          return newCards
        })
      }

      setTouchDragItem(null)
      setTouchDragPosition(null)
      setDragOverCardId(null)
      setIsDragReady(false)
      touchStartPosRef.current = null

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    },
    [touchDragItem, isDragReady, getCardUnderTouch],
  )

  const handleTouchCancel = useCallback(() => {
    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current)
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setTouchDragItem(null)
    setTouchDragPosition(null)
    setDragOverCardId(null)
    setIsDragReady(false)
    touchStartPosRef.current = null
  }, [])

  const addNewCard = () => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      title: "New Group",
      priority: cards.length + 1,
      items: [],
    }
    setCards((prev) => [...prev, newCard])
    setExpandedCards((prev) => new Set([...prev, newCard.id]))
  }

  return (
    <div className="flex flex-col gap-4 max-w-md flex-1 overflow-x-auto min-w-full lg:pb-4">
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {cards.map((card) => {
        const isExpanded = expandedCards.has(card.id)
        const isDragOver = dragOverCardId === card.id
        const isEditing = editingCardId === card.id

        return (
          <Card
            key={card.id}
            ref={(el) => {
              if (el) cardRefs.current.set(card.id, el)
              else cardRefs.current.delete(card.id)
            }}
            className={cn("transition-all duration-200 flex-1", isDragOver && "border-primary")}
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
                    <div className="flex justify-end">
                      <Button size="icon" variant="ghost" className="h-6 w-6 -mt-1 -mr-2" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`title-${card.id}`} className="text-xs text-muted-foreground">
                        Title
                      </Label>
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
                      <Label htmlFor={`priority-${card.id}`} className="text-xs text-muted-foreground">
                        Priority Value
                      </Label>
                      <Input
                        id={`priority-${card.id}`}
                        type="number"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="h-9"
                        placeholder="Priority"
                      />
                    </div>
                    <Button size="sm" className="w-full mt-1" onClick={saveEdit}>
                      Save changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-base flex items-center gap-2">
                      {card.title}
                      <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {card.priority}
                      </span>
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
                        disabled={card.items.length > 0}
                      >
                        <Trash2
                          className={cn(
                            "h-4 w-4 transition-colors",
                            card.items.length > 0
                              ? "text-muted-foreground/40"
                              : "text-muted-foreground group-hover/delete:text-red-500",
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
                <CardContent className="pt-0 pb-3">
                  {card.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                      Drop items here
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {card.items.map((item) => (
                        <li
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id, card.id)}
                          onDragEnd={handleDragEnd}
                          onTouchStart={(e) => handleTouchStart(e, item.id, card.id, item.label)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          onTouchCancel={handleTouchCancel}
                          className={cn(
                            "flex items-center gap-2 p-3 bg-secondary rounded-lg cursor-grab active:cursor-grabbing transition-opacity touch-none",
                            (draggedItem?.itemId === item.id || touchDragItem?.itemId === item.id) && "opacity-50",
                          )}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm flex-1">{item.label}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 shrink-0 group/itemdelete"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteItem(card.id, item.id)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground group-hover/itemdelete:text-red-500 transition-colors" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        )
      })}
          <Button onClick={addNewCard} variant="outline" className="">
            Add Group
          </Button>
      </div>

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
          <span className="text-sm">{draggedLabelRef.current}</span>
        </div>
      )}
    </div>
  )
}
