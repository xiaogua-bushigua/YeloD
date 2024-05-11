// svg => jsx: https://react-svgr.com/playground/
const SvgComponent = ({ fill }: { fill: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		width={20}
		height={20}
		viewBox="0 0 512 512"
		className={fill}
	>
		<path
			d="M512 416.744V23.814H0v392.93h190.512v35.721h-41.674v35.721h214.326v-35.721H321.49v-35.721H512zM35.721 59.535h440.558v250.046H35.721V59.535zm250.046 392.93h-59.535v-35.721h59.535v35.721zM35.721 381.023v-35.721h440.558v35.721H35.721z"
		/>
		<path
			d="M333.395 95.256V273.86h107.163V95.256H333.395zm71.442 142.884h-35.721V130.977h35.721V238.14zM202.419 95.256V273.86h107.163V95.256H202.419zM273.86 238.14h-35.72V130.977h35.721V238.14zM71.442 95.256V273.86h107.163V95.256H71.442zm71.442 142.884h-35.721V130.977h35.721V238.14z"
		/>
	</svg>
);
export default SvgComponent;
