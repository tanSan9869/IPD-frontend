import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children, className = '' }) => (
  <section className={`section ${className}`}>
    <div className="section-container">
      {title && (
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
      )}
      {children}
    </div>
  </section>
);

export default Section;
