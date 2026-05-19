import { Route, Routes } from "react-router";
import SignIn from "./features/auth/pages/SignIn.tsx";
import SignUp from "./features/auth/pages/SignUp.tsx";
import Home from "./features/auth/pages/Home.tsx";
import Protected from "./features/auth/components/Protected.tsx";
import Demo from "./features/auth/pages/Demo.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<Protected />}>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
