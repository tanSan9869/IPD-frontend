import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../index.css';


const HomePage = () => {
  const navigate = useNavigate();
  
  // Carousel state management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isDragging, setIsDragging] = useState(false);

  const handleRoleSelection = (role) => {
    navigate('/role-selection', { state: { selectedRole: role } });
  };

  const handleLogin = (role) => {
    navigate(`/${role}-login`);
  };

  const handleSignup = (role) => {
    navigate(`/${role}-signup`);
  };

  const features = [
    {
      icon: "/image/Group164.webp",
      title: "Secure File Upload & Decryption",
      description: "End-to-end encryption ensures your medical records are protected with advanced security protocols."
    },
    {
      icon: "/image/Group348.webp",
      title: "Doctor-Patient Communication",
      description: "Seamless messaging system for secure communication between healthcare providers and patients."
    },
    {
      icon: "/image/Group306.webp",
      title: "Appointment Booking",
      description: "Easy scheduling system with real-time availability and automated reminders."
    },
    {
      icon: "/image/Group4849.webp",
      title: "Unified Health Record Access",
      description: "Centralized platform to access and manage all your medical records in one secure location."
    }
  ];

  const specializations = [
    { name: "Cardiologist", image: "/image/Cardiologist.png" },
    { name: "Dentist", image: "/image/Dentist.png" },
    { name: "Dermatologist", image: "/image/dermatologist.png" },
    { name: "General Physician", image: "/image/General-Physician.png" },
    { name: "Gynecologist", image: "/image/Gynecologist.png" },
    { name: "Pediatrician", image: "/image/Pediatrician.png" },
    { name: "Orthopedic", image: "/image/Orthopedic.png" },
    { name: "Neurologist", image: "/image/Neurologist.png" },
    { name: "Ophthalmologist", image: "/image/Ophthalmologist.png" },
    { name: "ENT", image: "/image/ENT.png" },
    { name: "Urologist", image: "/image/Urologist.png" },
    { name: "Psychiatrist", image: "/image/Psychiatrist.png" },
    { name: "Gastroenterologist", image: "/image/Gastroenterologist.png" },
    { name: "Pulmonologist", image: "/image/Pulmonologist.png" },
    { name: "Endocrinologist", image: "/image/Endocrinologist.png" },
    { name: "Rheumatologist", image: "/image/Rheumatologist.png" },
    { name: "Oncologist", image: "/image/Oncologist.png" },
    { name: "Hematologist", image: "/image/Hematologist.png" },
    { name: "Nephrologist", image: "/image/Nephrologist.png" },
    { name: "Anesthesiologist", image: "/image/Anesthesiologist.png" },
    { name: "2.1.png", image: "/image/2.1.png" },
    { name: "2.2.png", image: "/image/2.2.png" },
    { name: "2.3.png", image: "/image/2.3.png" },
    { name: "2.4.png", image: "/image/2.4.png" },
    { name: "2.5.png", image: "/image/2.5.png" },
    { name: "2.6.png", image: "/image/2.6.png" },
    { name: "2.7.png", image: "/image/2.7.png" },
    { name: "2.8.png", image: "/image/2.8.png" },
    { name: "2.9.png", image: "/image/2.9.png" },
    { name: "2.10.png", image: "/image/2.10.png" },
    { name: "2.11.png", image: "/image/2.11.png" },
    {name  : "2.12.png", image: "/image/content2-img.webp"},
    {name : "2.13.png", image: "/image/main.png"},
    {name:'2,.14.png',image:'image/header.png'},
    {name:'2.15.png',image:'image/phone.png'}

  ];


  // Carousel functionality
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = specializations.length;
  const maxSlide = Math.max(0, totalSlides - slidesPerView);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getTransform = () => {
    return `translateX(-${currentSlide * (100 / slidesPerView)}%)`;
  };

  const healthTopics = [
    {
      category: "Health",
      title: "HOW TO IMPROVE YOUR DIGESTIVE HEALTH?",
      description: "The role of our digestive system is to break down the food we eat into the essential nutrients that will help our body. In cases when digestive health...",
      image: "/image/digestive.webp"
    },
    {
      category: "Orthopedics",
      title: "HOW TO GET RID OF KNEE PAIN?",
      description: "Knee pain is a common health issue affecting everyone at different life stages. Knee pain can be caused by injuries such as ligament or torn cartilage...",
      image: "/image/knee.webp"
    },
    {
      category: "Chronic Issues",
      title: "WHAT IS STOMACH CANCER?",
      description: "Stomach cancer, also known as gastric cancer, usually happens in the central part of the stomach, and slowly it starts to spread to other body parts...",
      image: "/image/cancer.webp"
    },
    {
      category: "Diabetes",
      title: "UNDERSTANDING DIABETES MANAGEMENT",
      description: "Learn about effective diabetes management strategies and how to maintain healthy blood sugar levels through proper diet and lifestyle...",
      image: "/image/diabetes.png"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Patient uploads medical files",
      description: "Patients securely upload their medical documents with encryption"
    },
    {
      number: "02", 
      title: "Doctor accepts and decrypts patient data",
      description: "Healthcare providers can access and review patient files securely"
    },
    {
      number: "03",
      title: "Both can manage appointments and communication",
      description: "Streamlined workflow for appointments and secure messaging"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Manish Sharma",
      role: "General Physician",
      content: "SmartHealth Connect has made digital consultations easy, and their concept of secure file sharing is what I like the most. The platform helps us create awareness about secure healthcare services.",
      avatar: "/image/manishsharma.webp",
      rating: 5
    },
    {
      name: "Dr. Akshata Gupta",
      role: "Cardiologist",
      content: "SmartHealth Connect gives me the freedom to provide consultation to patients anytime and anywhere. Furthermore, the best thing about patient consultation feature is that I can consult as many patients as I want with just a single click.",
      avatar: "/image/akshatagupta.webp",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "It's a great experience consulting through SmartHealth Connect. Consultation goes well without any glitches. The platform makes managing my medical records simple and secure.",
      avatar: "/image/ptMale.webp",
      rating: 5
    }
  ];
  





  return (
    <div className="homepage">
      {/* Header/Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/smartcare-logo.png" alt="SmartHealth Connect Logo" className="logo" />
          <span className="logo-text">SmartCare</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-buttons">
          <button  id='btn'className="nav-login-btn" onClick={() => navigate('/role-selection')}>
            Login
          </button>
          <button  id='btn1' className="nav-signup-btn" onClick={() => navigate('/role-selection')}>
          Sign up
          </button>
        </div>
      </nav>



<div className="conta">
  <img src="/image/header.png" alt="Doctor banner" className="card-image1" />


</div>




{/* <img className="img-fluid w-100" src="https://d3awrj7iclnjlr.cloudfront.net/images/content2-img.webp" loading="lazy" alt="First slide" data-v-0528e95d></img> */}
<div className="card">
  <img src="/image/main.png" alt="2.12.png" className="card-image" />
  <p className="card-name"></p>
</div>
      {/* Quick Access Panel
      <section className="quick-access-section">
        <div className="quick-access-container">
          <h2 className="section-title">Quick Access</h2>
          <div className="access-cards">
            <motion.div 
              className="access-card patient-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-icon">👤</div>
              <h3>Patient Portal</h3>
              <p>Access your medical records and book appointments</p>
              <div className="card-buttons">
                <button onClick={() => handleLogin('patient')}>Login</button>
                <button onClick={() => handleSignup('patient')}>Sign Up</button>
              </div>
            </motion.div>
            <motion.div 
              className="access-card doctor-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-icon">👩‍⚕️</div>
              <h3>Doctor Portal</h3>
              <p>Manage patients and access medical records</p>
              <div className="card-buttons">
                <button onClick={() => handleLogin('doctor')}>Login</button>
                <button onClick={() => handleSignup('doctor')}>Sign Up</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      
      {/* <section id="features" className="features-section">
        <div className="features-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose SmartHealth Connect?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="feature-icon">
                  <img src={feature.icon} alt={feature.title} className="feature-icon-img" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </section> */}




      {/* Specializations Section - Carousel */}
     <section className="specializations-section">
        <div className="specializations-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            Choose Best Doctors Based on Their Specialization
          </motion.h2>
          
          <div className="carousel">
            <div className="carousel__viewport">
              <div 
                className="carousel__track"
                style={{ transform: getTransform() }}
              >
                {specializations.map((spec, index) => (
                  <motion.div 
                    key={index}
                    className="carousel__slide"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.05,
                      ease: "easeInOut"
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="specialization-card-enhanced"
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { duration: 0.3, ease: "easeInOut" }
                      }}
                    >
                      <div className="specialization-card-inner">
                        <img src={spec.image} alt={spec.name} className="specialization-img-enhanced" />
                        <div className="specialization-content">
                          <h4 className="specialization-name-enhanced">{spec.name}</h4>
                        </div>
                        <div className="specialization-overlay">
                          <span className="specialization-overlay-text">{spec.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div> 



                  <div className="div">

                      <img src="/image/phone.png" alt="Doctor banner" className="card-image1" />
 
                  </div>

  

            {/* Navigation Arrows */}
            

            {/* <button 

              className={`carousel__prev ${currentSlide === 0 ? 'carousel__prev--disabled' : ''}`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous slide"
            >
              <svg className="carousel__icon" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button> */}
       
            
            {/* Pagination Dots */}

            {/* <ul className="carousel__pagination">
              {Array.from({ length: maxSlide + 1 }, (_, index) => (
                <li key={index}>
                  <button
                    className={`carousel__pagination-button ${currentSlide === index ? 'carousel__pagination-button--active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="app-features-section">
        <div className="app-features-container">
          <div className="app-features-content">
            <motion.div 
              className="app-features-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="app-features-title">
                Seamlessly Connect and Consult with Doctors Via Our User-Friendly Platform
              </h2>
              <div className="app-features-list">
                <div className="feature-item">
                  <img src="/image/Group4850.webp" alt="Health Records" className="feature-list-icon" />
                  <span>Maintaining the health records in one place</span>
                </div>
                <div className="feature-item">
                  <img src="/image/Blog.webp" alt="Health Articles" className="feature-list-icon" />
                  <span>Health and wellness articles</span>
                </div>
                <div className="feature-item">
                  <img src="/image/Group6798.webp" alt="Family Members" className="feature-list-icon" />
                  <span>Patient getting access of summaring their uploded file</span>
                </div>
                <div className="feature-item">
                  <img src="/image/Layer6copy.webp" alt="Video Consultation" className="feature-list-icon" />
                  <span>Can Easily Choose Doctors for Consultation</span>
                </div>
              </div>
              <div className="app-download-buttons">
                <img src="/image/playstore.png" alt="Google Play" className="download-btn" />
                <img src="/image/apple-logo.webp" alt="App Store" className="download-btn" />
              </div>
            </motion.div>
            <motion.div 
              className="app-features-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="/image/iPhone13Pro.png" alt="SmartHealth Connect App" className="app-mockup" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Health Blog Section */}
      <section className="health-blog-section">
        <div className="health-blog-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Stay Informed with SmartHealth Connect Health and Wellness Articles
          </motion.h2>
          <div className="blog-grid">
            {healthTopics.map((topic, index) => (
              <motion.div 
                key={index}
                className="blog-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="blog-image-container">
                  <img src={topic.image} alt={topic.title} className="blog-image" />
                  <div className="blog-category">{topic.category}</div>
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{topic.title}</h3>
                  <p className="blog-description">{topic.description}</p>
                  <a href="#" className="blog-read-more"> </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="step-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Real Stories, Real Impact: Here What Patients Have to Say
          </motion.h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="testimonial-avatar">
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-img" />
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
                <a href="#" className="testimonial-read-more">Read more</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img src="/image/statsslab.webp" alt="Stats" className="stat-image" />
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Happy Patients</p>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <img src="/image/top_doctor_dummy.jpg" alt="Doctors" className="stat-image" />
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Expert Doctors</p>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="/image/Group4886.webp" alt="Consultations" className="stat-image" />
              <h3 className="stat-number">50,000+</h3>
              <p className="stat-label">Consultations</p>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img src="/image/MaskGroup1.png" alt="Satisfaction" className="stat-image" />
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Satisfaction Rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      {/* <section className="qr-section">
        <div className="qr-container">
          <h3>Download App by Simply Scanning</h3>
          <img src="/image/qr-code (9).webp" alt="QR Code" className="qr-code" />
          <p>Scan to download SmartHealth Connect app</p>
          <div className="download-links">
            <img src="/image/playstore.png" alt="Google Play" className="download-btn-small" />
            <img src="/image/apple-logo.webp" alt="App Store" className="download-btn-small" />
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SmartHealth Connect</h3>
              <p>Connecting healthcare through secure digital innovation.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SmartHealth Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
