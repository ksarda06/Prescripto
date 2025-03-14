import React from 'react'
import Header from '../Components/Header'
import SpecialityMenu from '../Components/SpecialityMenu'
import Topdoctors from '../Components/Topdoctors'
import Banner from '../Components/Banner'
const Home = () => {
  return (
    <div>
       <Header/>
       <SpecialityMenu/>
       <Topdoctors/>
       <Banner/>
    </div>
  )
}

export default Home
