"use client"

import { X, Check } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"

interface ServiceDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  serviceData: any // Isme sirf service ka object aayega
}

export function ServiceDetailsModal({ isOpen, onClose, serviceData }: ServiceDetailsModalProps) {
  if (!serviceData) return null;

  const [currentIdx, setCurrentIdx] = useState(0);
  
  // API se images extract karna
  const images = serviceData.images?.map((img: any) => img.image) || ["https://placehold.co/600x400?text=No+Image"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{serviceData.name}</h2>
            <p className="text-sm text-[#1AB64F] font-semibold mt-1">Special Add-on Service</p>
          </div>
         
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          {/* Service Image */}
          <div className="h-64 bg-gray-100">
            <img 
              src={images[currentIdx]} 
              alt={serviceData.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="p-6">
            {/* Price Info */}
            <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
              <span className="text-gray-600 font-medium text-sm">Service Charge:</span>
              <span className="text-xl font-bold text-gray-900">₹{Number(serviceData.price?.preTaxRetailPrice).toLocaleString()}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About this service</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {serviceData.description}
              </p>
            </div>

            {/* Quick Features */}
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> Professional Service
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> Instant Confirmation
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}