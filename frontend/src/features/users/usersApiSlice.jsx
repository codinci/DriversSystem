import { apiSlice } from "../../app/api/apiSlice";

const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getUsers: builder.query({
			query: () => '/drivers',
			keepUnusedDataFor: 5,
		})
	})
})

export const {
	useGetUsersQuery
} = usersApiSlice;