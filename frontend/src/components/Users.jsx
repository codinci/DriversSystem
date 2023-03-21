import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  const navigate = useNavigate();
  const location = useLocation();

  let content;
  if (isLoading) {
    content = <p>Loading ...</p>;
  } else if (isSuccess) {
    content = (
      <section className="users">
        <h1>Drivers List</h1>
        {users?.length ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user?.firstname} {user?.lastname}
              </li>
            ))}
          </ul>
        ) : (
          <p>No drivers to display</p>
        )}
      </section>
    );
  } else if (isError) {
    content = <p>{ JSON.stringify(error)}</p>
  }

  return content
};

export default Users;
