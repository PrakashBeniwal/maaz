import React from 'react';
import styles from './styles.module.scss';

const Privacy = () => {
  return (
    <div className={styles.privacy_container}>
      <div className={styles.privacy_header}>
        <h1>Privacy Policy</h1>
        <div className={styles.separator}></div>
        <p>Last Updated: May 1, 2023</p>
      </div>

      <div className={styles.privacy_content}>
        <section className={styles.privacy_section}>
          <h2>1. Introduction</h2>
          <p>SYNCX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected to it.</p>
          <p>Please read this Privacy Policy carefully. By using our website, you consent to the data practices described in this policy.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you register with us, express an interest in obtaining information about us or our products and services, participate in activities on our website, or otherwise contact us. The personal information we collect may include:</p>
          
          <ul className={styles.privacy_list}>
            <li>Name and contact details (email address, phone number, shipping address, billing address)</li>
            <li>Account login credentials</li>
            <li>Payment information (credit card details, bank account details)</li>
            <li>Purchase history and preferences</li>
            <li>Any other information you choose to provide</li>
          </ul>
          
          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
          
          <ul className={styles.privacy_list}>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Pages you view</li>
            <li>Time and date of your visit</li>
            <li>Time spent on pages</li>
            <li>Other statistics</li>
          </ul>
          
          <h3>Cookies and Tracking Technologies</h3>
          <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the website and improve your experience. For more information about how we use cookies, please refer to our Cookie Policy.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including to:</p>
          
          <ul className={styles.privacy_list}>
            <li>Facilitate account creation and authentication</li>
            <li>Process your orders and transactions</li>
            <li>Provide and manage your account</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your inquiries and customer service requests</li>
            <li>Send you administrative information</li>
            <li>Send you marketing and promotional communications (if you have opted in)</li>
            <li>Personalize your experience and deliver content relevant to your interests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Improve our website, products, and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.privacy_section}>
          <h2>4. Disclosure of Your Information</h2>
          <p>We may share your information with:</p>
          
          <h3>Service Providers</h3>
          <p>We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.</p>
          
          <h3>Business Transfers</h3>
          <p>If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          
          <h3>Legal Requirements</h3>
          <p>We may disclose your information where we are legally required to do so to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal processes.</p>
          
          <h3>With Your Consent</h3>
          <p>We may disclose your personal information for any other purpose with your consent.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>5. Data Security</h2>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that no electronic transmission or storage of information can be guaranteed to be 100% secure.</p>
          <p>We do not store your payment card details on our systems. Payment transactions are encrypted and processed through our secure payment processors.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>6. Data Retention</h2>
          <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
          <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>7. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information. These may include:</p>
          
          <ul className={styles.privacy_list}>
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          
          <p>To exercise these rights, please contact us using the details provided in the "Contact Us" section below.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>8. Children's Privacy</h2>
          <p>Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so that we can delete such information.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>9. Third-Party Websites</h2>
          <p>Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>10. Updates to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
          <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        </section>

        <section className={styles.privacy_section}>
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <address className={styles.contact_address}>
            SYNCX<br />
            123 Main Street<br />
            City, State 12345<br />
            Email: privacy@eshop.com<br />
            Phone: +1 (123) 456-7890
          </address>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
