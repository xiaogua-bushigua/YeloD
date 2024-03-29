import * as React from 'react';

interface Props {
	size: number;
}

const LoadingIcon = ({ size }: Props) => (
	<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className='animate-spin' width={size} height={size} viewBox="0 0 26.349 26.35">
		<circle cx={13.792} cy={3.082} r={3.02} fill="#e53aff" />
		<circle cx={13.792} cy={24.501} r={1.849} fill="#edb0f5" />
		<circle cx={6.219} cy={6.218} r={2.774} fill="#e96bfc" />
		<circle cx={21.365} cy={21.363} r={1.541} fill="#ed8ffb" />
		<circle cx={3.082} cy={13.792} r={2.465} fill="#f2a4fc" />
		<circle cx={24.501} cy={13.791} r={1.232} fill="#fadaff" />
		<path
			d="M4.694 19.84a2.155 2.155 0 0 0 0 3.05 2.155 2.155 0 0 0 3.05 0 2.155 2.155 0 0 0 0-3.05 2.146 2.146 0 0 0-3.05 0z"
			fill="#f5bbff"
		/>
	</svg>
);
export default LoadingIcon;
