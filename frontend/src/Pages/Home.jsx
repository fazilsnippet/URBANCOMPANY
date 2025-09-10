import React from 'react'
import Carousel from "../components/service/serviceCorousel"
import ProductCarousel from "../components/products/productcard.jsx"
import TwoMen from '../components/products/twoProducts'
import Locker from '../components/pictures/locker'
import ServicesSection from '../components/service/serviceCard'
import Cleaning from '../components/service/cleaning'
import Sofa from '../components/pictures/sofa'
import ElectronicsCleaning from '../components/service/applicianClean/otherMachanical'
import HomeRepairInstallation from "../components/service/HouseHoldClean&Repair/homeRepair"
import Woman1 from '../components/service/spa/woman'
import Woman2 from '../components/service/spa/womanMassage'
import WallPanel from '../components/pictures/wallPanels'
import MenSaloon from '../components/service/spa/menSaloon'
import MenSpa from '../components/service/spa/menMassage'
import WaterPurifier from '../components/pictures/waterPurifier'
import Footer from '../components/Footer.jsx'



const Homepage = () => {
  return (
    <div className='w-full'>
        <ServicesSection/>
        <Carousel/>
                <ProductCarousel/>
                <WallPanel/>
                <TwoMen/>
                <Woman1/>
                <Woman2/>
<Locker/>
<Cleaning/>
<Sofa/>
<ElectronicsCleaning/>
<HomeRepairInstallation/>
<MenSpa/>
<WaterPurifier/>
<MenSaloon/>
<Footer/>    
    </div>
  )
}

export default Homepage
