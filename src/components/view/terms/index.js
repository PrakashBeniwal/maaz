import React from 'react';
import styles from './styles.module.scss';

const Terms = () => {
  return (
    <div className={styles.terms_container}>
      <div className={styles.terms_header}>
        <h1>Terms and Conditions</h1>
        <div className={styles.separator}></div>
        <p>Last Updated: May 1, 2025</p>
      </div>

      <div className={styles.terms_content}>
        <section className={styles.terms_section}>
          <h2>1. Introduction</h2>
          <p>Welcome to SyncX. These Terms and Conditions govern your use of our website and services, including the purchase of products from our online store. By accessing or using our website, you agree to be bound by these Terms and Conditions.</p>
          <p>Please read these Terms and Conditions carefully before using our website or services. If you do not agree with any part of these terms, you must not use our website or services.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>2. Definitions</h2>
          <p>In these Terms and Conditions:</p>
          <ul className={styles.terms_list}>
            <li>"We", "us", "our", and "SyncX" refers to our company and website.</li>
            <li>"Website" refers to our online platform located at www.syncx.com and all its subdomains.</li>
            <li>"User", "you", and "your" refers to the individual accessing or using our website and services.</li>
            <li>"Products" refers to the items available for purchase on our website.</li>
            <li>"Terms" refers to these Terms and Conditions.</li>
          </ul>
        </section>

        <section className={styles.terms_section}>
          <h2>3. Account Registration</h2>
          <p>To access certain features of our website, including making purchases, you may need to create an account. When creating an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <p>We reserve the right to terminate or suspend your account at our discretion, without notice, if we believe you have violated these Terms or for any other reason.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>4. Products and Pricing</h2>
          <p>We strive to provide accurate product descriptions and pricing information. However, we do not warrant that product descriptions, images, or pricing information are accurate, complete, reliable, current, or error-free. In the event of a pricing error, we reserve the right to cancel any orders placed for products that were incorrectly priced.</p>
          <p>All prices are displayed in the currency specified on the website and do not include taxes, shipping fees, or other charges unless explicitly stated. These additional costs will be calculated and displayed before you complete your purchase.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>5. Orders and Payment</h2>
          <p>By placing an order, you are making an offer to purchase products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraud.</p>
          <p>We accept various payment methods as specified on our website. By providing payment information, you represent and warrant that you have the legal right to use the payment method provided and that the information you provide is accurate.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>6. Shipping and Delivery</h2>
          <p>We will make reasonable efforts to deliver products within the estimated delivery times. However, delivery times are not guaranteed, and delays may occur due to various factors beyond our control.</p>
          <p>Risk of loss and title for products pass to you upon delivery by us to the carrier.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>7. Returns and Refunds</h2>
          <p>Our returns and refunds policy is detailed in our separate Shipping & Returns policy, which is incorporated into these Terms by reference.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>8. Intellectual Property</h2>
          <p>All content on our website, including but not limited to text, graphics, logos, images, product descriptions, and software, is the property of SyncX or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.</p>
          <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our express written consent.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>9. User Conduct</h2>
          <p>You agree not to use our website or services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our website or interfere with any other party's use and enjoyment of our website.</p>
          <p>You further agree not to:</p>
          <ul className={styles.terms_list}>
            <li>Use any robot, spider, or other automatic device or process to access our website for any purpose, including monitoring or copying any material on our website;</li>
            <li>Introduce any viruses, trojan horses, worms, logic bombs, or other harmful material;</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of our website, the server on which our website is stored, or any server, computer, or database connected to our website;</li>
            <li>Attack our website via a denial-of-service attack or a distributed denial-of-service attack.</li>
          </ul>
        </section>

        <section className={styles.terms_section}>
          <h2>10. Disclaimer of Warranties</h2>
          <p>Our website and products are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          <p>We do not warrant that our website will be uninterrupted or error-free, that defects will be corrected, or that our website or the server that makes it available are free of viruses or other harmful components.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>11. Limitation of Liability</h2>
          <p>In no event shall SyncX, its directors, officers, employees, agents, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our website or services.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>12. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless SyncX, its directors, officers, employees, agents, partners, and suppliers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of our website, violation of these Terms, or violation of any rights of a third party.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>13. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>14. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. The updated Terms will be effective immediately upon posting on our website. Your continued use of our website after any such changes constitutes your acceptance of the new Terms.</p>
        </section>

        <section className={styles.terms_section}>
          <h2>15. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <address className={styles.contact_address}>
            SyncX<br />
            123 Main Street<br />
            City, State 12345<br />
            Email: legal@syncx.com<br />
            Phone: +1 (123) 456-7890
          </address>
        </section>
      </div>
    </div>
  );
};

export default Terms;

