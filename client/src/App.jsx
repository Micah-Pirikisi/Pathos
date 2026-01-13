import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import About from "./pages/About.jsx";
import { Header } from "./components/Header.jsx";

export default function App() {
  return (
    <>
      <div className="shell">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:slug" element={<MovieDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
