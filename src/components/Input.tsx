'use client';
import React, { useEffect, useState, RefObject, useRef, forwardRef, Ref } from 'react';

interface Props {
	title: string;
	type: string;
	name: string;
	placeholder: string;
	className: string;
	value?: string;
}

const Input = forwardRef((props: Props, ref: Ref<HTMLInputElement>) => {
	const { title, name, type, value, placeholder, className } = props;
	const [focus, setFocus] = useState(false);
	const [content, setContent] = useState('');
	useEffect(() => {
		setContent(value || '');
	}, []);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContent(e.target.value);
	};
	return (
		<div className="relative w-full">
			<label
				className={`absolute left-4 top-1 font-mono text-neutral-800 ${focus && 'bold text-violet-900'}`}
				htmlFor={title}
			>
				{title}
			</label>
			<input
        ref={ref}
				type={type}
				placeholder={placeholder}
				id={title}
				value={content}
				autoComplete="off"
				name={name}
				className={`pt-7 px-4 pb-1 rounded-md text-sm text-violet-500 focus:outline-none focus:ring focus:ring-violet-300 ${className}`}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				onChange={handleChange}
			/>
		</div>
	);
});

export default Input;
