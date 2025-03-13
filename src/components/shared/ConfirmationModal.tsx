import React, { JSX } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  message,
}): JSX.Element => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#11142f] border-[#384455] p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white mb-4 flex items-center justify-center">
            <div className="bg-green-500 rounded-full p-2 mb-4">
              <Check className="h-6 w-6 text-white" />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <p className="text-[#809fb8]">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
