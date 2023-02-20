import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Components/Login";
import Register from "./Components/Register";
import LinkPage from "./Components/LinkPage";
import Unauthorized from "./Components/Unauthorized";
import Home from "./Components/Home";
import Editor from "./Components/Editor";
import Admin from "./Components/Admin";
import Lounge from "./Components/Lounge";
import Missing from "./Components/Missing";
import RequireAuth from "./Components/RequireAuth";

const App = () => {
  const ROLES = {
    User: 2001,
    Editor: 3201,
    Admin: 5321,
  };
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route
          element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Editor]} />}
        >
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="/*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
