import { useState, useEffect } from "react";

const getLocalValue = (key, initVal) => {
	//SSR NextJs
	if (typeof window === 'undefined') return initVal;

	//if a value is already stored
	const localValue = JSON.parse(localStorage.getItem(key));
	if (localValue) return localValue;

	//return result of a function
	if (initVal instanceof Function) return initVal();

	return initVal;

}

const useLocalStorage = (key, initVal) => {
	const [value, setValue] = useState(() => {
		return getLocalValue(key, initVal);
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue]

}

export default useLocalStorage;