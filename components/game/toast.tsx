'use client'

interface ToastProps {
  message: string | null
}

export function GameToast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black border border-red-600 px-8 py-3 rounded-md text-[10px] z-[100] text-red-500 uppercase text-center shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
      {message}
    </div>
  )
}
