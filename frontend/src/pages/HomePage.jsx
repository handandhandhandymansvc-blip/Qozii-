import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ServiceAreas from '../components/ServiceAreas';
import QuoteForm from '../components/QuoteForm';
import WhyChooseUs from '../components/WhyChooseUs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <ServiceAreas />
      <QuoteForm />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
