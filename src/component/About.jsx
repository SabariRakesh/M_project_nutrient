import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="aboutContainer">
      <h1>Welcome to Our Nutrition Companion</h1>
      <p className="missionStatement">
        "Our mission is to empower individuals to make smarter nutrition choices using cutting-edge technology."
      </p>

      <h2>✨ How It Works</h2>
      <ul className="howItWorks">
        <li>📸 **Upload a Food Image** - Our AI instantly identifies the dish.</li>
        <li>📊 **View Nutrition Details** - Get calories, macros, and health scores.</li>
        <li>📅 **Track Your Diet** - Visualize your eating habits over time.</li>
        <li>💡 **Get Smart Recommendations** - Discover healthier alternatives and fitness tips.</li>
      </ul>

      <h2>🔧 Technology Behind the Magic</h2>
      <ul className="techStack">
        <li>🤖 **AI Model** (trained using FastAPI + TensorFlow)</li>
        <li>☁️ **AWS Cloud** (S3, Lambda, API Gateway)</li>
        <li>⚛️ **React** (Fast, responsive frontend)</li>
        <li>🔐 **Privacy First** – Your data is secure with us.</li>
      </ul>

      <h2>👤 Who We Are</h2>
      <p>
        Built by a passionate team of developers and fitness geeks from India, this app combines love for tech and health to make lives better.
      </p>

      <h2>🌟 Why Choose Us?</h2>
      <ul className="whyChooseUs">
        <li>⚡ Fast and accurate food recognition</li>
        <li>🌿 Clean, distraction-free UI</li>
        <li>💰 Free to use, always</li>
        <li>💪 We genuinely care about your health and fitness journey</li>
      </ul>

      <h2>📬 Get in Touch</h2>
      <p>Have feedback or want to get involved? <a href="mailto:feedback@nutrientapp.com">Send us a message!</a></p>
    </div>
  );
};

export default About;
