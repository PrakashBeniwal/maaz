import React, { useState } from 'react';
import styles from './styles.module.scss';

const FAQ = () => {
  // Sample FAQ data
  const faqData = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, select the items you want, add them to your cart, and proceed to checkout. Follow the steps to enter your shipping and payment information, then confirm your order.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express),HBL, and bank transfers. All transactions are securely processed and encrypted.'
    },
    {
      id: 3,
      question: 'How long will it take to receive my order?',
      answer: 'Delivery times depend on your location and the shipping method selected. Standard shipping typically takes 3-7 business days, while express shipping can arrive within 1-3 business days. International orders may take 7-14 business days.'
    },
    {
      id: 4,
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you will receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.'
    },
    {
      id: 5,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached and original packaging. Please visit our Returns & Refunds page for detailed information and instructions.'
    },
    {
      id: 6,
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Additional customs fees or import taxes may apply depending on your country\'s regulations.'
    },
    {
      id: 7,
      question: 'How can I change or cancel my order?',
      answer: 'You can request changes or cancellations within 1 hour of placing your order by contacting our customer service team. Once an order begins processing, we cannot guarantee it can be modified or canceled.'
    },
    {
      id: 8,
      question: 'Are my personal and payment details secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your personal and payment information. We do not store your full credit card details on our servers and comply with all relevant data protection regulations.'
    },
    {
      id: 9,
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout and even include a personalized message for the recipient.'
    },
    {
      id: 10,
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team through the Contact Us page, by email at support@eshop.com, by phone at +1 (123) 456-7890, or via live chat on our website during business hours (Monday-Friday, 9am-5pm).'
    }
  ];

  // State to track which FAQ item is open
  const [openId, setOpenId] = useState(null);

  // Toggle FAQ item
  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.faq_container}>
      <div className={styles.faq_header}>
        <h1>Frequently Asked Questions</h1>
        <div className={styles.separator}></div>
        <p>Find answers to common questions about our products, ordering process, shipping, and more.</p>
      </div>
      
      <div className={styles.faq_content}>
        <div className={styles.faq_list}>
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className={`${styles.faq_item} ${openId === item.id ? styles.active : ''}`}
            >
              <div 
                className={styles.faq_question}
                onClick={() => toggleFAQ(item.id)}
              >
                <h3>{item.question}</h3>
                <div className={styles.faq_icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {openId === item.id ? (
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    ) : (
                      <>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </>
                    )}
                  </svg>
                </div>
              </div>
              <div className={styles.faq_answer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.faq_contact}>
          <h3>Still have questions?</h3>
          <p>If you couldn't find the answer to your question, please contact our customer support team.</p>
          <a href="/contact" className={styles.contact_button}>Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 
