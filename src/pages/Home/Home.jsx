import React from 'react'
import Hero from '../../components/Home/Hero';
import './Home.css';
import RecentlyAdded from '../../components/Home/RecentlyAdded';
import Footer from '../../components/Footer/Footer';
const home = () => {
  return (
    <div className="home-container">
      <Hero />
      <RecentlyAdded />
      <Footer />
    </div>
  );
}

export default home
