'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import editorjsCodeflask from '@calumk/editorjs-codeflask';
import { setTempOption } from '@/store/reducers/chartSlice';
import { useAppDispatch } from '@/store/hooks';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

const ChartOptions = () => {
	const { option } = useAppSelector((state: RootState) => state.chart);

	const ejInstance = useRef<any>(null);
	const dispatch = useAppDispatch();
	const DEFAULT_INITIAL_DATA = {
		time: new Date().getTime(),
		blocks: [
			{
				type: 'code',
				data: {
					code: JSON.stringify(option, null, 2),
					language: 'javascript',
					showlinenumbers: true,
				},
			},
		],
	};
	const getEditor = () => {
		const editor = new EditorJS({
			holder: 'editorjs',
			tools: {
				code: editorjsCodeflask,
			},
			autofocus: true,
			data: DEFAULT_INITIAL_DATA,
			onChange: async (api) => {
				let content = await api.saver.save();
				const code = content.blocks[0].data.code;
				dispatch(setTempOption(code));
			},
		});
		return editor;
	};

	useEffect(() => {
		if (!ejInstance.current) {
			const editor = getEditor();
			ejInstance.current = editor;
		}
		return () => {
			if (ejInstance.current?.destroy) {
				ejInstance.current?.destroy();
				ejInstance.current = null;
			}
		};
	}, [option]);

	return <div id="editorjs"></div>;
};

export default ChartOptions;
