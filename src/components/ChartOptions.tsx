'use client';

import React, { useState, useRef } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const ChartOptions = ({ option }: { option: any }) => {
  const [code, setCode] = useState(`
 const fib = (n) => {
   if (n <= 1) {
     return n;
   }
   return fib(n - 1) + fib(n - 2);
 };
`);
const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<div
			role="button"
			tabIndex={0}
			onKeyDown={() => textareaRef.current?.focus()}
			onClick={() => textareaRef.current?.focus()}
			className="relative w-full h-full flex"
		>
			<textarea
				className="absolute inset-0 py-3 resize-none bg-transparent font-mono text-transparent caret-white outline-none"
				value={code}
				ref={textareaRef}
				onChange={(e) => setCode(e.target.value)}
			/>
			<SyntaxHighlighter
				language="javascript"
				className="flex-1 shadow-md border-2 border-t-slate-200 border-indigo-50 rounded-lg h-full"
				customStyle={{
					paddingLeft: '0.75em',
				}}
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
};

export default ChartOptions;
