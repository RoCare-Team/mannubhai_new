"use client";

import React from "react";
import Dropdown from "@/components/Dropdown";

const PrivacyPolicy = () => {
  const countries = [
    { code: "IND", name: "India", flag: "/flags/In-flag.jpeg" },
    { code: "UAE", name: "United Arab Emirates", flag: "/flags/UAE-flag.jpeg" },
    { code: "SGP", name: "Singapore", flag: "/flags/Singapore-flag.jpeg" },
    { code: "KSA", name: "Saudi Arabia", flag: "/flags/KSA-flag.jpeg" },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">PRIVACY POLICY</h1>
        <Dropdown countries={countries} />
      </div>

      <article className="prose prose-lg max-w-none">
        <h3>Mannu Bhai - Official Privacy Policy</h3>
        <p>
          Mannu Bhai esteem & humbly revere the privacy of all visitors to our
          site. Under no conditions Mannu Bhai will not pass the consumer
          personal information to outside agents, unless we re legally eligible
          to do so. All personal information supplied to Mannu Bhai, through its
          web sites or other ways, is shielded. In using our site, you agree to
          the Privacy policy of Mannu Bhai India. We reserve the right to alter,
          alter, add, or remove portions of this policy at any moment. Your
          continuing use of the website following changes to these terms means
          you accept these changes.
        </p>

        <h3>Mannu Bhai - Official Privacy Policy</h3>
        <p>
          At Mannu Bhai, we are committed to protecting the privacy of our
          clients. Mannu Bhai does not sell, rent, or loan any identifiable
          information at the individual level regarding its customers to any
          third party. Any information you provide us is held with the utmost
          care and security. This information is collected primarily to ensure
          that we can satisfy your needs and to deliver you a genuinely
          personalized shopping experience. When you buy products from Mannu
          Bhai or register with us for any services, you have the choice of
          getting e-mails regarding updates about special offers, new products,
          and new services. We are also bound to cooperate fully if we are
          required by law or legal process to offer information about a client.
          We might share non-personal, non-individual statistical or demographic
          information in aggregate form with our marketing partners,
          advertisers, or other third parties for advertising and research
          purposes. To put it differently, we won t tell our marketing partners
          that you purchased a particular solution, but we can tell them how
          many customers purchased that product. As a continuing policy of
          product improvement at Mannu Bhai, the design and specifications are
          subject to change without prior notice. This Privacy Policy can be
          changed at the sole discretion of Mannu Bhai from time to time. In the
          event of any concern about your privacy, please visit us at{" "}
          <a
            href="mailto:info@mannubhai.com"
            className="text-indigo-600 underline"
          >
            info@mannubhai.com
          </a>{" "}
          and we will respond to you immediately.
        </p>
      </article>
    </section>
  );
};

export default PrivacyPolicy;
