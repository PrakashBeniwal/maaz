import React from 'react';
import styles from './styles.module.scss';

const ShippingReturns = () => {
  return (
    <div className={styles.shipping_container}>
      <div className={styles.shipping_header}>
        <h1>Shipping & Returns</h1>
        <div className={styles.separator}></div>
      </div>
      
      <div className={styles.shipping_content}>
        <section className={styles.policy_section}>
          <h2>Shipping Policy</h2>
          
          <div className={styles.policy_item}>
            <h3>Processing Time</h3>
            <p>All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Shipping Options</h3>
            <div className={styles.shipping_table}>
              <div className={styles.table_header}>
                <div className={styles.header_cell}>Shipping Method</div>
                <div className={styles.header_cell}>Estimated Delivery Time</div>
                <div className={styles.header_cell}>Cost</div>
              </div>
              <div className={styles.table_row}>
                <div className={styles.table_cell}>Standard Shipping</div>
                <div className={styles.table_cell}>3-7 business days</div>
                <div className={styles.table_cell}>Rs 500</div>
              </div>
              <div className={styles.table_row}>
                <div className={styles.table_cell}>Express Shipping</div>
                <div className={styles.table_cell}>1-3 business days</div>
                <div className={styles.table_cell}>Rs 1000</div>
              </div>
              <div className={styles.table_row}>
                <div className={styles.table_cell}>International Shipping</div>
                <div className={styles.table_cell}>7-14 business days</div>
                <div className={styles.table_cell}>Rs 2000+</div>
              </div>
            </div>
          </div>
          
          {/*<div className={styles.policy_item}>
            <h3>International Shipping</h3>
            <p>We ship to most countries worldwide. Please note that international shipping times can vary significantly depending on the destination country and customs processing.</p>
            <p>Customers are responsible for any customs duties, taxes, and fees that may apply to international orders. These charges vary by country and are not included in the shipping cost.</p>
          </div>*/}
          
          <div className={styles.policy_item}>
            <h3>Shipping Restrictions</h3>
            <p>Some products cannot be shipped to certain locations due to local regulations. If we are unable to ship a product to your location, we will notify you and provide a refund for the affected items.</p>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Order Tracking</h3>
            <p>Once your order ships, you will receive a tracking number via email. You can track your order by clicking the tracking link in the email or by logging into your account on our website.</p>
          </div>
        </section>
        
        <section className={styles.policy_section}>
          <h2>Returns Policy</h2>
          
          <div className={styles.policy_item}>
            <h3>Return Eligibility</h3>
            <p>We accept returns within 3 days of delivery for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
            <p>Some items cannot be returned, including:</p>
            <ul className={styles.policy_list}>
              <li>Gift cards</li>
              <li>Downloadable software products</li>
              <li>Personal care items that have been opened or used</li>
              <li>Custom or personalized orders</li>
            </ul>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Return Process</h3>
            <p>To initiate a return:</p>
            <ol className={styles.policy_list_numbered}>
              <li>Log in to your account and navigate to the order history</li>
              <li>Select the order containing the item(s) you wish to return</li>
              <li>Click on "Return Items" and follow the instructions</li>
              <li>Print the return shipping label (if provided)</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Attach the return shipping label to the outside of the package</li>
              <li>Drop off the package at the specified carrier location</li>
            </ol>
            <p>Alternatively, you can contact our customer service team for assistance with your return.</p>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Refunds</h3>
            <p>Once we receive and inspect your return, we will notify you about the status of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.</p>
            <p>Please note:</p>
            <ul className={styles.policy_list}>
              <li>Original shipping charges are non-refundable</li>
              <li>Return shipping costs are the responsibility of the customer unless the return is due to our error</li>
              <li>Items returned in used or damaged condition may receive a partial refund or be rejected</li>
            </ul>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Exchanges</h3>
            <p>If you need to exchange an item for a different size or color, please return your original purchase and place a new order for the desired item. This ensures faster processing and availability.</p>
          </div>
          
          <div className={styles.policy_item}>
            <h3>Damaged or Defective Items</h3>
            <p>If you receive a damaged or defective item, please contact our customer service team immediately. We will provide instructions for returning the item and will cover the return shipping costs in these cases.</p>
            <p>Please include photos of the damaged or defective product to help us process your claim more efficiently.</p>
          </div>
        </section>
        
       {/* <div className={styles.contact_section}>
          <h3>Questions About Shipping or Returns?</h3>
          <p>If you have any questions about our shipping or returns policies, please don't hesitate to contact our customer service team.</p>
          <a href="/contact" className={styles.contact_button}>Contact Us</a>
        </div>*/}
      </div>
    </div>
  );
};

export default ShippingReturns;
