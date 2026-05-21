import { Route, Routes } from "react-router";
import SignIn from "./features/auth/pages/SignIn.tsx";
import SignUp from "./features/auth/pages/SignUp.tsx";
import Home from "./features/interview/pages/Home.tsx";
import Interview from "./features/interview/pages/Interview.tsx";
import Reports from "./features/interview/pages/Reports.tsx";
import Protected from "./features/auth/components/Protected.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<Protected />}>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
