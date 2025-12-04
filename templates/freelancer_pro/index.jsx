function FreelancerPro({ data = {} }) {
  const hero = data.hero || {};
  const services = data.services || [];
  const portfolio = data.portfolio || [];
  const contact = data.contact || {};

  return (
    <div className="freelancer-pro-portfolio" style={{ fontFamily: "'Open Sans', sans-serif", backgroundColor: "#ffffff", color: "#2d3748" }}>
      {/* Hero Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, marginBottom: "1rem" }}>
            {hero.name || "David Freelancer"}
          </h1>
          <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 400, marginBottom: "1rem", opacity: 0.95 }}>
            {hero.title || "Freelance Designer & Developer"}
          </h2>
          <p style={{ fontSize: "1.125rem", marginBottom: "1rem", opacity: 0.9 }}>
            {hero.tagline || "Turning ideas into digital reality"}
          </p>
          {hero.availability && (
            <span style={{ 
              display: "inline-block", 
              padding: "0.5rem 1.5rem", 
              backgroundColor: "rgba(255,255,255,0.2)", 
              borderRadius: "25px", 
              fontSize: "0.9rem",
              marginTop: "1rem"
            }}>
              {hero.availability}
            </span>
          )}
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section style={{ padding: "6rem 2rem", backgroundColor: "#f7fafc" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center", color: "#2d3748" }}>Services & Pricing</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {services.map((service, index) => (
                <div key={index} style={{ backgroundColor: "#ffffff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#2d3748" }}>{service.name}</h3>
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: "#667eea", marginBottom: "1rem" }}>{service.price}</p>
                  <p style={{ color: "#718096", lineHeight: 1.6 }}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {portfolio.length > 0 && (
        <section style={{ padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center", color: "#2d3748" }}>Recent Work</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {portfolio.map((item, index) => (
                <div key={index} style={{ backgroundColor: "#f7fafc", borderRadius: "12px", overflow: "hidden" }}>
                  {item.image && (
                    <img src={item.image} alt={item.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "2rem" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#2d3748" }}>{item.title}</h3>
                    <p style={{ color: "#667eea", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>{item.client}</p>
                    <p style={{ color: "#718096", lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", backgroundColor: "#2d3748", color: "#ffffff" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>Let's Work Together</h2>
          {contact.email && (
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>{contact.email}</a>
            </p>
          )}
          {contact.phone && (
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>{contact.phone}</p>
          )}
          {contact.website && (
            <p>
              <a href={contact.website} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "none" }}>Visit Website</a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

