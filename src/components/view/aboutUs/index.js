import React from 'react';
import styles from './styles.module.scss';

const AboutUs = () => {
  return (
    <div className={styles.about_container}>
      <div className={styles.about_header}>
        <h1>About Us</h1>
        <div className={styles.separator}></div>
      </div>
      
      <div className={styles.about_content}>
        <section className={styles.about_section}>
          <h2>Our Story</h2>
          <p>
            Founded in 2018, our e-commerce platform began with a simple mission: to provide customers with high-quality products and an exceptional shopping experience. What started as a small online store has now grown into a trusted marketplace serving customers worldwide.
          </p>
          <p>
            Our journey has been defined by a commitment to quality, innovation, and customer satisfaction. We've carefully curated our product selection to ensure that every item meets our high standards of excellence.
          </p>
        </section>

        <section className={styles.about_section}>
          <h2>Our Mission</h2>
          <p>
            We strive to create a seamless shopping experience that delights our customers at every touchpoint. Our mission is to connect people with products they'll love, delivered with unparalleled service and care.
          </p>
          <p>
            We believe in building lasting relationships with our customers based on trust, transparency, and exceptional value.
          </p>
        </section>

        <section className={styles.about_section}>
          <h2>Our Team</h2>
          <p>
            Behind our platform is a dedicated team of professionals passionate about e-commerce and customer service. From our product specialists to our customer support team, we work together to ensure that your shopping experience exceeds expectations.
          </p>
          <p>
            We're constantly learning, innovating, and improving to better serve our customers and adapt to the evolving digital landscape.
          </p>
        </section>

        <section className={styles.about_section}>
          <h2>Our Commitment</h2>
          <p>
            Customer satisfaction is at the heart of everything we do. We're committed to:
          </p>
          <ul className={styles.commitment_list}>
            <li>Offering carefully selected, high-quality products</li>
            <li>Providing exceptional customer service</li>
            <li>Ensuring secure and convenient shopping</li>
            <li>Continuously improving our platform based on customer feedback</li>
            <li>Maintaining fair pricing and transparent policies</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 