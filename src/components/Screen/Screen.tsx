'use client';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

const Screen = forwardRef(({}, ref) => {
	const screenRef = useRef<HTMLDivElement>(null);
	const { background } = useAppSelector((state: RootState) => state.screen);
	useImperativeHandle(ref, () => ({
		getScreenRef: () => screenRef.current,
	}));
	return (
		<div
			ref={screenRef}
			className={`w-full h-full bg-slate-50 rounded-lg border border-slate-300 bg-cover ${
				background === 'light' ? "bg-[url('/imgs/light.png')]" : "bg-[url('/imgs/dark.png')]"
			}`}
		></div>
	);
});

export default Screen;
