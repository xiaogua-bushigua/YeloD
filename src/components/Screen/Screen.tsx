'use client';
import React, { forwardRef, useRef, useImperativeHandle } from 'react';

const Screen = forwardRef(({}, ref) => {
	const screenRef = useRef<HTMLDivElement>(null);
	useImperativeHandle(ref, () => ({
		getScreenRef: () => screenRef.current,
	}));
	return (
		<div ref={screenRef} className="w-full h-full bg-slate-200">
			qwe
		</div>
	);
});

export default Screen;
