import { logOut } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../app/store";

const useLogout = () => {
	// const { setAuth } = useAuth();
	const dispatch = useDispatch();

	const logout = async () => {
		// setAuth({});
		try {
			dispatch(logOut());
			persistor.purge();
		} catch (err) {
			console.error(err);
		}
	}
	return logout;
}

export default useLogout;