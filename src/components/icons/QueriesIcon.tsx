// svg => jsx: https://react-svgr.com/playground/
const QueriesIcon = ({ fill }: { fill: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={20}
		height={20}
		data-name="Layer 1"
		viewBox="0 0 32 32"
		className={fill}
	>
		<circle cx={11} cy={15.5} r={1.5} />
		<path d="M12 12h-2V8h2a2 2 0 0 0 0-4h-2a2.002 2.002 0 0 0-2 2v.5H6V6a4.005 4.005 0 0 1 4-4h2a4 4 0 0 1 0 8Z" />
		<path d="M22.448 21.034a10.971 10.971 0 0 0-2.527-16.29l-.999 1.73A8.997 8.997 0 1 1 5 14H3a10.992 10.992 0 0 0 18.034 8.448L28.586 30 30 28.586Z" />
		<path
			d="M0 0h32v32H0z"
			data-name="&lt;Transparent Rectangle&gt;"
			style={{
				fill: 'none',
			}}
			transform="rotate(-180 16 16)"
		/>
	</svg>
);
export default QueriesIcon;
