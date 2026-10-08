// Return policy section rendered inside the policies page.
import React from "react";

const ReturnPolicy: React.FC = () => {
  return (
    <section id="return-policy" className="policy-section">
      <h1>Return Policy</h1>
      <p>
        GLEWORKS does not currently accept public orders, checkout submissions,
        product purchases, or service bookings through this website. Historical
        keyboard work is shown for archive and portfolio purposes only.
      </p>
      <h3>Current Status</h3>
      <p>
        Commissions and service requests are temporarily closed while the site
        and service pages are updated. There is no active return, exchange,
        refund, or cancellation flow through this website.
      </p>
      <h3>Archived Projects</h3>
      <p>
        Archive entries, photos, project notes, and past commission references
        are not current product listings. They do not represent available
        inventory, active pricing, shipping terms, or a promise to reproduce a
        previous build.
      </p>
      <h3>Previous Work</h3>
      <p>
        If you have a question about previous work that involved you directly,
        contact hello.gleworks@gmail.com with the relevant context. Any follow-up
        will be handled case by case outside the public website.
      </p>
    </section>
  );
};

export default ReturnPolicy;
