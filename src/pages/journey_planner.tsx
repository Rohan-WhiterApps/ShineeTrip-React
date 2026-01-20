"use client"


import { useState } from "react"
import { Calendar, MapPin, Users, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export default function JourneyPlanner() {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date(2025, 9, 17))
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>()
  const [state, setState] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ]

  const cities: Record<string, string[]> = {
    Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Pushkar"],
    Kerala: ["Kochi", "Thiruvananthapuram", "Munnar", "Alleppey"],
    Maharashtra: ["Mumbai", "Pune", "Aurangabad", "Nashik"],
    Karnataka: ["Bangalore", "Mysore", "Coorg", "Hampi"],
    "Tamil Nadu": ["Chennai", "Ooty", "Madurai", "Kanyakumari"],
  }

  return (
    <div className="w-full max-w-2xl mx-auto ">
      <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200 relative">
        {/* Close Button */}
        {/* <button className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition">
          <X size={28} />
        </button> */}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">PLAN YOUR JOURNEY 2.0</h1>
          <p className="text-gray-600 text-lg">Select your travel dates and destination to find the perfect getaway</p>
        </div>

        {/* Form Grid */}
        <div className="space-y-6 mb-8">
          {/* Check-in and Check-out Dates */}
          <div className="grid grid-cols-2 gap-6">
            {/* Check-in Date */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <Calendar size={20} className="text-white" />
                CHECK-IN DATE *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 text-left hover:border-gray-400 transition bg-white flex items-center justify-between">
                    <span>{checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Select date"}</span>
                    <Calendar size={18} className="text-[#D4A76A]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <Calendar size={20} className="text-white" />
                CHECK-OUT DATE *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 text-left hover:border-gray-400 transition bg-white flex items-center justify-between">
                    <span>{checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Select date"}</span>
                    <Calendar size={18} className="text-[#D4A76A]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => (checkInDate ? date <= checkInDate : date < new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* State and City */}
          <div className="grid grid-cols-2 gap-6">
            {/* State */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <MapPin size={20} className="text-amber-600" />
                STATE *
              </label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition bg-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <MapPin size={20} className="text-amber-600" />
                CITY *
              </label>
              <Select value={city} onValueChange={setCity} disabled={!state}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition bg-white disabled:opacity-50">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {state &&
                    cities[state]?.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adults and Children */}
          <div className="grid grid-cols-2 gap-6">
            {/* Adults */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <Users size={20} className="text-amber-600" />
                ADULTS *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-semibold"
                >
                  −
                </button>
                <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-gray-900 font-semibold bg-white">
                  {adults}
                </div>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div>
              <label className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm tracking-wide">
                <Users size={20} className="text-amber-600" />
                CHILDREN
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-semibold"
                >
                  −
                </button>
                <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-gray-900 font-semibold bg-white">
                  {children}
                </div>
                <button
                  onClick={() => setChildren(children + 1)}
                  className="w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="w-full bg-[#D4A76A] hover:bg-amber-700 text-white font-semibold py-4 rounded-lg mb-6 flex items-center justify-center gap-2 transition text-lg">
          <Search size={24} />
          Search Packages
        </button>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-base">
          Our travel experts will help you find the perfect package for your journey
        </p>
      </div>
    </div>
  )
}
