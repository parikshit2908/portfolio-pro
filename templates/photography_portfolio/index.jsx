function PhotographyPortfolio({ data = {} }) {
  const hero = data.hero || {};
  const gallery = data.gallery || [];
  const about = data.about || {};
  const contact = data.contact || {};

  return (
    <div className="photography-portfolio" style={{ fontFamily: "'Playfair Display', serif", backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Hero Section */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 400, marginBottom: "1rem", letterSpacing: "0.05em" }}>
          {hero.name || "Emma Photography"}
        </h1>
        <p style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)", fontWeight: 300, marginBottom: "0.5rem", opacity: 0.9 }}>
          {hero.tagline || "Capturing moments that last forever"}
        </p>
        <p style={{ fontSize: "1.125rem", opacity: 0.7 }}>
          {hero.specialization || "Wedding & Portrait Photography"}
        </p>
      </section>

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section style={{ padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {gallery.map((photo, index) => (
                <div 
                  key={index}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.transition = "transform 0.3s ease";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {photo.image ? (
                    <img 
                      src={photo.image} 
                      alt={photo.title}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        filter: "grayscale(100%)",
                        transition: "filter 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.filter = "grayscale(0%)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.filter = "grayscale(100%)";
                      }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#666", fontSize: "0.9rem" }}>{photo.title}</span>
                    </div>
                  )}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    padding: "2rem 1rem 1rem",
                    opacity: 0,
                    transition: "opacity 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                  >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>{photo.title}</h3>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {about.content && (
        <section style={{ padding: "6rem 2rem", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "3rem", fontWeight: 400, marginBottom: "2rem" }}>About</h2>
              <p style={{ fontSize: "1.125rem", lineHeight: 1.8, opacity: 0.9 }}>
                {about.content}
              </p>
            </div>
            {about.image && (
              <div>
                <img src={about.image} alt="About" style={{ width: "100%", borderRadius: "8px" }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", borderTop: "1px solid #333" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 400, marginBottom: "2rem" }}>Let's Create Together</h2>
          {contact.email && (
            <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#ffffff", textDecoration: "none" }}>{contact.email}</a>
            </p>
          )}
          {contact.instagram && (
            <p>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none" }}>Instagram</a>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

