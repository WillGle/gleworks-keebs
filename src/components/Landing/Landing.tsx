// Public landing page for the main marketing experience.
import React from "react";
import "./Landing.css";

import image1 from "../../assets/landing.webp";
import about from "../../assets/about.webp";

// Landing component representing the landing page
const Landing: React.FC = () => {
  return (
    <div className="landing">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Masterpiece comes with immaculate craftsmanship</h1>
          <p>
            Step into custom keyboard world, where creativity knows no bounds,
            and every mechanical keyboard transcends mere functionality to
            become a work of art.
          </p>
        </div>
        <img
          src={image1}
          alt="A beautiful custom keyboard"
          className="hero-image"
        />
      </section>

      <section className="about-section">
        <img
          src={about}
          alt="Chí-Cường Nguyễn"
          className="about-image"
          loading="lazy"
        />
        <div className="about-content">
          <h1>Chí-Cường Nguyễn</h1>
          <h2>
            <i>
              <span>Gleammy</span>
            </i>
          </h2>
          <p>
            Have you ever experienced the joy and motivation that come from
            creating something with your own hands?
          </p>
          <p>
            Since childhood, I have been deeply fascinated by intricate
            mechanical devices. As I grew older, this passion drove me to
            explore and immerse myself in the world of mechanical keyboards,
            where I could blend my skills with my personal interests
          </p>

          <p>
            Here, my passions and hobbies intersect, inspiring the creation of
            vibrant and innovative works of art.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Landing;
