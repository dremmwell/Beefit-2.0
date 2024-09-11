"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useDebounce } from 'use-debounce'

export default function SearchBar() {

const router = useRouter()
const [searchInput, setSearchInput] = useState("")

// Debouncing means delaying the user query (here for 200ms) not to spam the server at each input change //
const [debouncedQuery] = useDebounce(searchInput, 200)

// Pushes the search values to the url so it can be accessed by other components //
useEffect(() => {
    if(debouncedQuery) {
        router.push(`/app/recipes?search=${debouncedQuery}`)
    }
    else{
        router.push(`/app/recipes`)
    }

},[debouncedQuery, router])

  return (
    <Input
    id="filterInput"
    placeholder="Filter recipes..."
    className="max-w-sm mr-4"
    onChange={(e) => setSearchInput(e.target.value)}
  />
  )
}
