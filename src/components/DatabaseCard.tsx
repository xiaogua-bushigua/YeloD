'use client';
import React from 'react';

interface Props {
	link: string;
}

const DatabaseCard = ({ link }: Props) => {
	return <div>{link}</div>;
};

export default DatabaseCard;
