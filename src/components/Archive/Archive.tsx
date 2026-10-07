// Gallery-style archive page for completed work.
import React from "react";
import "./Archive.css";
import image1 from "../../assets/a3.webp";
import image3 from "../../assets/sams46_promo.webp";
import image4 from "../../assets/sams46.webp";
import image5 from "../../assets/keychron_promo.webp";
import selected01 from "../../assets/selected-01.webp";
import selected02 from "../../assets/selected-02.webp";
import selected03 from "../../assets/selected-03.webp";
import selected04 from "../../assets/selected-04.webp";
import selected05 from "../../assets/selected-05.webp";
import selected06 from "../../assets/selected-06.webp";
import selected07 from "../../assets/selected-07.webp";
import selected08 from "../../assets/selected-08.webp";
import selected09 from "../../assets/selected-09.webp";
import selected10 from "../../assets/selected-10.webp";
import selected11 from "../../assets/selected-11.webp";
import selected12 from "../../assets/selected-12.webp";
import selected13 from "../../assets/selected-13.webp";
import selected14 from "../../assets/selected-14.webp";
import selected15 from "../../assets/selected-15.webp";

// Archive component representing the archive page
const Archive: React.FC = () => {
  const selectedImages = [
    selected01,
    selected02,
    selected03,
    selected04,
    selected05,
    selected06,
    selected07,
    selected08,
    selected09,
    selected10,
    selected11,
    selected12,
    selected13,
    selected14,
    selected15,
  ];

  const featuredItems = [
    {
      id: 1,
      description: "Donkey A3 custom WHITE spray coated ",
      image: image1,
    },
    {
      id: 3,
      description: "Sam48 assem Virus lubed + ping fixed + MLv2 modded",
      image: image3,
    },
    {
      id: 4,
      description: "Sam48 assem Virus lubed + ping fixed + MLv2 modded",
      image: image4,
    },
    {
      id: 5,
      description:
        "Keychron K4 case modded + assem Gateron brown Lubed + stab (stock) modded",
      image: image5,
    },
  ];
  const maxFeaturedId = Math.max(...featuredItems.map((item) => item.id));
  const selectedItems = selectedImages.map((image, index) => ({
    id: maxFeaturedId + index + 1,
    description: `Selected GleWorks archive ${index + 1}`,
    image,
  }));
  const items = [...featuredItems, ...selectedItems];

  return (
    <div className="archive">
      <h1 className="archive-title">Archive</h1>
      <div className="archive-list">
        {items.map((item) => (
          <div key={item.id} className="archive-item">
            <img src={item.image} alt={item.description} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
