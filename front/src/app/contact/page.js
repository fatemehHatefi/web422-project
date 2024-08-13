'use client';

import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    
  console.log("testsubmit");
    e.preventDefault();
    try {
      
  console.log("testsubmit");
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      
  console.log(response);

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('An error occurred.');
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.heading}>Contact Us</h1>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <label htmlFor="name" className={styles.label}>
          Name:
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label htmlFor="email" className={styles.label}>
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label htmlFor="message" className={styles.label}>
          Message:
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          Send Message
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default Contact;
