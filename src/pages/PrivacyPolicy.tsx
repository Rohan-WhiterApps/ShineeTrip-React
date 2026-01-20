import React from 'react';
import { Navbar } from './Navbar';
import Footer from './LandingPage/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="pt-20 min-h-screen bg-gray-50 font-opensans">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#2C4A5E] mb-8 border-b-2 border-[#C9A961] pb-4 inline-block">
            Privacy Policy
          </h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-[#2C4A5E] mb-3">1. Introduction</h2>
              <p>
                Welcome to Shinee Trip. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#2C4A5E] mb-3">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Identity Data includes first name, last name, username or similar identifier.</li>
                <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#2C4A5E] mb-3">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#2C4A5E] mb-3">4. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: 
                <a href="mailto:info@shineetrip.com" className="text-[#C9A961] hover:underline ml-1">info@shineetrip.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
