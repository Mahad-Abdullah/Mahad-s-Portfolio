import "./App.css";
import About from "./Componnents/about";
import Contact from "./Componnents/contact";
import Experince from "./Componnents/experince";
import Footer from "./Componnents/footer";
import Hero from "./Componnents/hero";
import Navbar from "./Componnents/navbar";
import Projects from "./Componnents/projects";
import Skills from "./Componnents/skills";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About/>
      <Skills/>
      <Projects/>
      <Experince/>
      <Contact/>
      <Footer/>
    </>
  );
}

export default App;
