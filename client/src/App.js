import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import Login from "./screens/auth/login";
import Signup from "./screens/auth/signup";
import AskAstro from "./screens/AskAstro";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Signup />} />
          <Route path="/ask-astroai/:id" element={<AskAstro />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
