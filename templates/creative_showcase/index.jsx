function CreativeShowcase({ data = {} }) {
  const hero = data.hero || {};
  const portfolio = data.portfolio || [];
  const contact = data.contact || {};

  return (
    <div className="creative-showcase-portfolio" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#ffffff", color: "#1a1a1a" }}>
      {/* Hero Section */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "4rem 2rem", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.1 }}>
              {hero.name || "Sarah Creative"}
            </h1>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 400, marginBottom: "2rem", opacity: 0.95 }}>
              {hero.title || "Visual Artist & Designer"}
            </h2>
            <p style={{ fontSize: "1.25rem", lineHeight: 1.8, opacity: 0.9 }}>
              {hero.bio || "I create visual experiences that tell stories and evoke emotions."}
            </p>
          </div>
          {hero.hero_image && (
            <div>
              <img src={hero.hero_image} alt={hero.name} style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} />
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Grid */}
      {portfolio.length > 0 && (
        <section style={{ padding: "6rem 2rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "4rem", textAlign: "center" }}>My Work</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
              {portfolio.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px",
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {item.image && (
                    <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
                      <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ padding: "2rem" }}>
                    <span style={{ 
                      display: "inline-block", 
                      padding: "0.25rem 0.75rem", 
                      backgroundColor: "#f5576c", 
                      color: "#ffffff", 
                      borderRadius: "20px", 
                      fontSize: "0.875rem", 
                      fontWeight: 600,
                      marginBottom: "1rem"
                    }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                    <p style={{ color: "#666", lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", backgroundColor: "#1a1a1a", color: "#ffffff" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>Let's Work Together</h2>
          {contact.email && (
            <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#f5576c", textDecoration: "none", fontWeight: 600 }}>{contact.email}</a>
            </p>
          )}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none", fontSize: "1.125rem" }}>Instagram</a>
            )}
            {contact.behance && (
              <a href={contact.behance} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none", fontSize: "1.125rem" }}>Behance</a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

