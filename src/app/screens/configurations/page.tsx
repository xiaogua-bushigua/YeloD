"use client";
import React, { useEffect, useRef, useState } from 'react';
import ScreenOperations from '@/components/Screen/ScreenOperations';
import Screen from '@/components/Screen/Screen';

const page = () => {
  const screenRef = useRef<any>(null);
  const [screen, setScreen] = useState<any>(null);
  useEffect(() => {
    const element = screenRef.current!.getScreenRef();
    setScreen(element);
  }, [])
	return (
		<div className="w-full h-full overflow-hidden flex flex-col gap-4">
			<ScreenOperations screenRef={screen} />
			<Screen ref={screenRef} />
		</div>
	);
};

export default page;
