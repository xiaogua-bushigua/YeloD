'use client';

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
	const { toasts } = useToast();

	const giveColor = (value: string) => {
		switch (value) {
			case 'Success':
				return 'text-violet-800';
			case 'Error':
				return 'text-red-500';
			case 'Suspend':
				return 'text-yellow-500';
			default:
				break;
		}
	};

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle className={`font-mono ${giveColor(title)}`}>{title}</ToastTitle>}
							{description && <ToastDescription className="font-mono">{description}</ToastDescription>}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
