import { useEffect, useRef, useState } from "react"
import { Input } from "@/Components/shadcnui/input"

interface SmartDropdownProps<T> {
  label: string
  placeholder?: string
  items: T[]
  getLabel: (item: T) => string
  getValue: (item: T) => string
  selectedId: string
  onChange: (id: string) => void
  error?: string
}

export default function SmartDropdown<T>({
  label,
  placeholder = "Search...",
  items,
  getLabel,
  getValue,
  selectedId,
  onChange,
  error,
}: SmartDropdownProps<T>) {
  const [typedText, setTypedText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState(items)

  const dropdownRef = useRef<HTMLDivElement>(null)

  

  useEffect(() => {
    const search = typedText.toLowerCase()
    const results = items.filter((item) =>
      getLabel(item).toLowerCase().includes(search)
    )
    setFilteredItems(results)
  }, [typedText, items, getLabel])

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setIsOpen(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center font-medium text-sm">
        {label}
        {label === "Location" && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>
      <div className="relative">
        <Input
          value={typedText}
          onChange={(e) => {
            setTypedText(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
        />
        {isOpen && (
          <div className="absolute z-10 bg-white border w-full rounded shadow max-h-60 overflow-y-auto mt-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={getValue(item)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setTypedText(getLabel(item))
                    onChange(getValue(item))
                    setIsOpen(false)
                  }}
                >
                  {getLabel(item)}
                </div>
              ))
            ) : (
                <div className="px-4 py-2 text-gray-500 italic">
                {label === "Location"
                  ? "Location doesn't exist yet and will be created."
                  : "No matches"}
                </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
