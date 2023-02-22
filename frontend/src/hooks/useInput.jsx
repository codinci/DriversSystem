import useLocalStorage from "./useLocalStorage";

const useInput = (key, initVal) => {
	const [value, setValue] = useLocalStorage(key, initVal);

	const reset = () => setValue(initVal);

	const attributeObj = {
		value,
		onChange: (event) => setValue(event.target.value)
	}

	return [value, reset, attributeObj];
}

export default useInput;