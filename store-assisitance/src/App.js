import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UploadProductImages from "./screens/uploadImages/UploadProductImages";
import { useEffect } from "react";

function App() {
  const updateViewPort = () => {
    let viewport = window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${viewport}px`);
    console.log(viewport);
  };

  useEffect(() => {
    updateViewPort();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/upload/:storeID' element={<UploadProductImages />} />
        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
