function ModernMinimal({ data = {} }) {
  const hero = data.hero || {};
  const about = data.about || {};
  const projects = data.projects || [];
  const contact = data.contact || {};

  return (
    <div className="modern-minimal-portfolio">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          backgroundColor: hero.background_color || "#ffffff",
          color: hero.text_color || "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem"
        }}
      >
        <div className="hero-content" style={{ maxWidth: "800px" }}>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            fontWeight: 700, 
            marginBottom: "1rem",
            letterSpacing: "-0.02em"
          }}>
            {hero.title || "John Doe"}
          </h1>
          <h2 style={{ 
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)", 
            fontWeight: 400, 
            marginBottom: "1.5rem",
            opacity: 0.8
          }}>
            {hero.subtitle || "Creative Designer"}
          </h2>
          <p style={{ 
            fontSize: "1.125rem", 
            lineHeight: 1.6, 
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            {hero.description || "I create beautiful digital experiences that inspire and engage."}
          </p>
          {hero.cta_text && (
            <a 
              href="#projects" 
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                border: `2px solid ${hero.text_color || "#1a1a1a"}`,
                color: hero.text_color || "#1a1a1a",
                textDecoration: "none",
                fontWeight: 600,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = hero.text_color || "#1a1a1a";
                e.target.style.color = hero.background_color || "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = hero.text_color || "#1a1a1a";
              }}
            >
              {hero.cta_text}
            </a>
          )}
        </div>
      </section>

      {/* About Section */}
      {about.heading && (
        <section 
          id="about" 
          className="about-section"
          style={{
            padding: "6rem 2rem",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "center"
          }}>
            <div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                fontWeight: 700, 
                marginBottom: "1.5rem" 
              }}>
                {about.heading}
              </h2>
              <p style={{ 
                fontSize: "1.125rem", 
                lineHeight: 1.8, 
                color: "#666" 
              }}>
                {about.content}
              </p>
            </div>
            {about.image && (
              <div>
                <img 
                  src={about.image} 
                  alt="About" 
                  style={{ 
                    width: "100%", 
                    borderRadius: "8px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                  }} 
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section 
          id="projects" 
          className="projects-section"
          style={{
            padding: "6rem 2rem",
            backgroundColor: "#f8f9fa"
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: 700, 
              marginBottom: "3rem",
              textAlign: "center"
            }}>
              My Work
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem"
            }}>
              {projects.map((project, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      style={{ 
                        width: "100%", 
                        height: "200px", 
                        objectFit: "cover" 
                      }} 
                    />
                  )}
                  <div style={{ padding: "2rem" }}>
                    <h3 style={{ 
                      fontSize: "1.5rem", 
                      fontWeight: 600, 
                      marginBottom: "0.5rem" 
                    }}>
                      {project.title}
                    </h3>
                    <p style={{ 
                      color: "#666", 
                      lineHeight: 1.6,
                      marginBottom: "1rem"
                    }}>
                      {project.description}
                    </p>
                    {project.link && (
                      <a 
                        href={project.link}
                        style={{
                          color: "#1a1a1a",
                          textDecoration: "none",
                          fontWeight: 600,
                          borderBottom: "2px solid #1a1a1a"
                        }}
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section 
        id="contact" 
        className="contact-section"
        style={{
          padding: "6rem 2rem",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 700, 
            marginBottom: "2rem" 
          }}>
            Get In Touch
          </h2>
          <div style={{ marginBottom: "2rem" }}>
            {contact.email && (
              <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
                <strong>Email:</strong> <a href={`mailto:${contact.email}`} style={{ color: "#1a1a1a" }}>{contact.email}</a>
              </p>
            )}
            {contact.phone && (
              <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
                <strong>Phone:</strong> {contact.phone}
              </p>
            )}
          </div>
          {contact.social && (
            <div style={{ 
              display: "flex", 
              gap: "1.5rem", 
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {contact.social.linkedin && (
                <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a", fontSize: "1.5rem" }}>LinkedIn</a>
              )}
              {contact.social.twitter && (
                <a href={contact.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a", fontSize: "1.5rem" }}>Twitter</a>
              )}
              {contact.social.github && (
                <a href={contact.social.github} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a", fontSize: "1.5rem" }}>GitHub</a>
              )}
              {contact.social.dribbble && (
                <a href={contact.social.dribbble} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a", fontSize: "1.5rem" }}>Dribbble</a>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

