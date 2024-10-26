import React from 'react'
import Banner from '../../components/Banner';
import Categories from './Categories';
import Specialdishes from './Specialdishes';
import Testimonials from './Testimonials';
import Services from './Services';

const Home = () => {
  return (
    <div>
      <Banner/>
      <Categories/>   
      <Specialdishes/>
      <Testimonials/>
      <Services/>
    </div>
  )
}

export default Home;