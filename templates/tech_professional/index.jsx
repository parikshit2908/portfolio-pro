function TechProfessional({ data = {} }) {
  const hero = data.hero || {};
  const skills = data.skills || [];
  const projects = data.projects || [];
  const experience = data.experience || [];
  const contact = data.contact || {};

  return (
    <div className="tech-professional-portfolio" style={{ fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: "#0a0a0a", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ padding: "8rem 2rem", textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            {hero.name || "Alex Johnson"}
          </h1>
          <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 400, marginBottom: "1.5rem", opacity: 0.9 }}>
            {hero.title || "Full Stack Developer"}
          </h2>
          <p style={{ fontSize: "1.25rem", lineHeight: 1.6, marginBottom: "2rem", opacity: 0.9 }}>
            {hero.tagline || "Building scalable solutions with modern technologies"}
          </p>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {hero.github && (
              <a href={hero.github} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none", padding: "0.75rem 1.5rem", border: "2px solid #ffffff", borderRadius: "6px", fontWeight: 600 }}>
                GitHub
              </a>
            )}
            {hero.linkedin && (
              <a href={hero.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "none", padding: "0.75rem 1.5rem", border: "2px solid #ffffff", borderRadius: "6px", fontWeight: 600 }}>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>Technical Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {skills.map((skill, index) => (
              <div key={index} style={{ backgroundColor: "#1a1a1a", padding: "1.5rem", borderRadius: "8px", border: "1px solid #333" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>{skill.name}</h3>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>{skill.level}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section style={{ padding: "6rem 2rem", backgroundColor: "#111111" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>Featured Projects</h2>
            <div style={{ display: "grid", gap: "2rem" }}>
              {projects.map((project, index) => (
                <div key={index} style={{ backgroundColor: "#1a1a1a", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                    <h3 style={{ fontSize: "1.75rem", fontWeight: 600 }}>{project.name}</h3>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "none" }}>GitHub</a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "none" }}>Live Demo</a>
                      )}
                    </div>
                  </div>
                  <p style={{ color: "#aaa", lineHeight: 1.6, marginBottom: "1rem" }}>{project.description}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {project.tech_stack && project.tech_stack.split(", ").map((tech, i) => (
                      <span key={i} style={{ backgroundColor: "#667eea", color: "#ffffff", padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.875rem" }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>Work Experience</h2>
          <div style={{ display: "grid", gap: "2rem" }}>
            {experience.map((exp, index) => (
              <div key={index} style={{ borderLeft: "3px solid #667eea", paddingLeft: "2rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{exp.role}</h3>
                  <p style={{ color: "#667eea", fontWeight: 600, marginBottom: "0.25rem" }}>{exp.company}</p>
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>{exp.period}</p>
                </div>
                <p style={{ color: "#aaa", lineHeight: 1.6 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: "6rem 2rem", textAlign: "center", backgroundColor: "#111111" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>Get In Touch</h2>
          {contact.email && (
            <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              <a href={`mailto:${contact.email}`} style={{ color: "#667eea", textDecoration: "none" }}>{contact.email}</a>
            </p>
          )}
          {contact.location && (
            <p style={{ color: "#888", fontSize: "1rem" }}>{contact.location}</p>
          )}
        </div>
      </section>
    </div>
  );
}

