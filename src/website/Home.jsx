import React from "react";
import NavBar from "../components/NavBar";
import Hero from "./components/Hero";
import HeroCards from "./components/HeroCards";
import Services from "./components/Services";
import CTA from "./components/CTA";
import TestPapersHome from "./components/TestPapersHome";
import Footer from "../components/Footer";
import Reviews from "./components/Reviews";
import Hero2 from "./components/Hero2";
import HomeSections from "./components/HomeSections";

function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <HomeSections/>
      <CTA />
      <Reviews/>
      <Footer/>
    </div>
  );
}

export default Home;
