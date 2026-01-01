import { Routes, Route } from "react-router-dom";
import { Navbar } from "./pages/Navbar";
import Footer from "./pages/LandingPage/Footer";

import DiscoverAdventure from "./pages/LandingPage/Dsicoveradventure";

import Testimonials from "./pages/LandingPage/Testimonials";
import ContactForm from "./pages/LandingPage/ContactForm";
import RoomBookingPage from "./pages/Properties_details";

import BookingPage from "./pages/Payment_Page";
import HotelListingPage from "./pages/Hotel_listing_page";
import Tourspackages from "./pages/Tour_packages";
import HeroSection from "./pages/LandingPage/HeroSection";
import AboutPage from "./AboutPage";
import PackagesPage from "./toursPackages/Pacakges";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import HolidayPackages from "./pages/HolidayPackages/pages/HolidayPackages";
import PackageDetailsPage from "./pages/HolidayPackages/pages/PackageDetailsPage";
 




const App: React.FC = () => {

 
  return (
<>
      <Navbar />
      <Routes>
  <Route
    path="/"
    element={
      <>
        <section id="home">
          <HeroSection />
        </section>

        <section id="adventure">
          {<DiscoverAdventure /> }
        </section>


        <section id="testimonials">
          { <Testimonials /> }
        </section>

        <section id="contact">
          { <ContactForm /> }
        </section>
      </>
    }
  /> 
  <Route path="/room-booking/:hotelId" element={<RoomBookingPage />} />
  <Route path="/booking" element={<BookingPage />} />
  <Route path="/hotellists" element={<HotelListingPage/>} />
  <Route path="/tours" element={<Tourspackages/>}/>
  <Route path="/profile" element={<CustomerProfilePage/>}/>
  <Route path="/mybooking" element={<MyBookingsPage/>}/>
  
  

  
   
    <Route path="/holiday-packages" element={<HolidayPackages />} />
    <Route path="/package-detail/:id" element={<PackageDetailsPage/>}/>
  
    <Route path='/about' element={<AboutPage/>}/>
    <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
  </Routes>

      <Footer />
      
  </>
  );
};


export default App;