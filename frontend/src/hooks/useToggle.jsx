import useLocalStorage from "./useLocalStorage";

const useToggle = (key, initVal) => {
	const [value, setValue] = useLocalStorage(key, initVal);

	const toggle = (value) => {
		setValue(prev => {
			return typeof value === 'boolean' ? value : !prev;
		})
	}

	return [value, toggle]

}

export default useToggle;