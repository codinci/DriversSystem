import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:3500',
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token
		if (token) {
			headers.set('authorization', `Bearer ${token}`)
		}
		return headers;
	}
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	// console.log(localStorage.getItem('persist'));
	

	if (result?.error?.originalStatus === 403) {
		console.log('sending refresh token');
		//sending refresh token to get new access token
		const refreshResult = await baseQuery('/refresh', api, extraOptions);
		console.log(refreshResult);
		if (refreshResult?.data) {
			const user = api.getState().auth.user;
			//store new token
			api.dispatch(setCredentials({ ...refreshResult.data, user }))
			//retry original request with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logOut())
		}
	}
	return result;
}

export const apiSlice = createApi({
	baseQuery: baseQueryWithReAuth,
	endpoints: builder => ({})
})