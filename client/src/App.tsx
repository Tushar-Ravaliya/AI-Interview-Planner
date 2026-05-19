import { Route, Routes } from "react-router";
import SignIn from "./features/auth/pages/SignIn.tsx";
import SignUp from "./features/auth/pages/SignUp.tsx";
import Home from "./features/auth/pages/Home.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
