function BusinessExecutive({ data = {} }) {
  const hero = data.hero || {};
  const services = data.services || [];
  const testimonials = data.testimonials || [];
  const contact = data.contact || {};

  return (
    <div className="business-executive-portfolio" style={{ fontFamily: "'Georgia', serif", backgroundColor: "#ffffff", color: "#2c3e50" }}>
      {/* Hero Section */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center", borderBottom: "3px solid #2c3e50" }}>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, marginBottom: "1rem", color: "#2c3e50" }}>
          {hero.name || "Michael Chen"}
        </h1>
        <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 400, marginBottom: "0.5rem", color: "#34495e" }}>
          {hero.title || "Senior Business Consultant"}
        </h2>
        {hero.company && (
          <p style={{ fontSize: "1.125rem", color: "#7f8c8d", marginBottom: "2rem" }}>{hero.company}</p>
        )}
        <p style={{ fontSize: "1.125rem", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto", color: "#555" }}>
          {hero.summary || "20+ years of experience in strategic planning and business transformation."}
        </p>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section style={{ padding: "6rem 2rem", backgroundColor: "#f8f9fa" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center", color: "#2c3e50" }}>Services</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {services.map((service, index) => (
                <div key={index} style={{ backgroundColor: "#ffffff", padding: "2.5rem", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: "#2c3e50" }}>{service.title}</h3>
                  <p style={{ lineHeight: 1.8, color: "#555" }}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section style={{ padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center", color: "#2c3e50" }}>Client Testimonials</h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} style={{ padding: "2.5rem", borderLeft: "4px solid #2c3e50", backgroundColor: "#f8f9fa" }}>
                  <p style={{ fontSize: "1.125rem", lineHeight: 1.8, fontStyle: "italic", color: "#555", marginBottom: "1.5rem" }}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p style={{ fontWeight: 600, color: "#2c3e50", marginBottom: "0.25rem" }}>{testimonial.author}</p>
                    <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>{testimonial.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", backgroundColor: "#2c3e50", color: "#ffffff" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>Get In Touch</h2>
          {contact.email && (
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#ffffff", textDecoration: "none" }}>{contact.email}</a>
            </p>
          )}
          {contact.phone && (
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>{contact.phone}</p>
          )}
          {contact.linkedin && (
            <p style={{ marginTop: "1.5rem" }}>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none" }}>LinkedIn</a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

