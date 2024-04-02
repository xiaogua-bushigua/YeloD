// svg => jsx: https://react-svgr.com/playground/
const ChartIcon = ({ fill }: { fill: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" className={fill}>
		<path
			fillRule="evenodd"
			d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Zm0-2.007a8.993 8.993 0 0 1-1-17.931v8.524A2 2 0 0 0 11.586 13l6.027 6.027A8.955 8.955 0 0 1 12 20.993Zm7.027-3.38-4.271-4.272a.2.2 0 0 1 .141-.341h6.041a8.95 8.95 0 0 1-1.911 4.613ZM20.938 11H13.5a.5.5 0 0 1-.5-.5V3.062A8.997 8.997 0 0 1 20.938 11Z"
			clipRule="evenodd"
		/>
	</svg>
);
export default ChartIcon;
