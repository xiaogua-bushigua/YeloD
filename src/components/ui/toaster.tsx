"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
			<Toast key={id} {...props}>
				<div className="grid gap-1">
					{title && <ToastTitle className={`font-mono ${title === 'Success' ? 'text-violet-800': 'text-red-500'}`}>{title}</ToastTitle>}
					{description && <ToastDescription className="font-mono">{description}</ToastDescription>}
				</div>
				{action}
				<ToastClose />
			</Toast>
		);
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
