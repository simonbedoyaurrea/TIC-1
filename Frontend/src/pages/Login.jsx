import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        fontFamily: "'DM Mono', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .left-panel {
          width: 55%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          animation: slide-in 0.8s ease forwards;
        }

        .right-panel {
          width: 45%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 50px;
          position: relative;
          animation: slide-in-right 0.8s ease forwards;
          clip-path: polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .right-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #dc2626, #facc15, #dc2626);
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }

        .stat-card {
          border: 1px solid rgba(220,38,38,0.3);
          padding: 16px 20px;
          position: relative;
          transition: all 0.3s;
          cursor: default;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px;
          height: 100%;
          background: #dc2626;
        }
        .stat-card:hover {
          border-color: rgba(220,38,38,0.7);
          background: rgba(220,38,38,0.05);
          transform: translateX(4px);
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: #111;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #dc2626;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }
        .input-field::placeholder {
          color: #9ca3af;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #0a0a0a;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent);
          transition: left 0.4s;
        }
        .submit-btn:hover {
          background: #dc2626;
          letter-spacing: 4px;
        }
        .submit-btn:hover::after {
          left: 100%;
        }
        .submit-btn:disabled {
          background: #6b7280;
          cursor: not-allowed;
          letter-spacing: 3px;
        }

        .label {
          display: block;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .geo-shape {
          position: absolute;
          border: 1px solid rgba(220,38,38,0.2);
          animation: float 6s ease-in-out infinite;
        }

        .corner-tag {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(220,38,38,0.5);
          text-transform: uppercase;
        }

        .input-wrap {
          position: relative;
          animation: fade-up 0.6s ease forwards;
          opacity: 0;
        }
        .input-wrap:nth-child(1) { animation-delay: 0.3s; }
        .input-wrap:nth-child(2) { animation-delay: 0.5s; }

        .cursor {
          display: inline-block;
          width: 2px;
          height: 0.9em;
          background: #facc15;
          margin-left: 4px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }

        .loading-dots span {
          display: inline-block;
          width: 6px; height: 6px;
          background: #fff;
          border-radius: 50%;
          margin: 0 2px;
          animation: blink 1s infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(220,38,38,0.4);
          animation: pulse-ring 3s ease-out infinite;
        }
      `}</style>

      {/* Background grid */}
      <div className="grid-bg" />

      {/* Decorative shapes */}
      <div
        className="geo-shape"
        style={{
          width: 120,
          height: 120,
          top: "10%",
          left: "5%",
          animationDelay: "0s",
        }}
      />
      <div
        className="geo-shape"
        style={{
          width: 60,
          height: 60,
          top: "70%",
          left: "15%",
          animationDelay: "2s",
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="geo-shape"
        style={{
          width: 200,
          height: 200,
          top: "40%",
          left: "30%",
          animationDelay: "1s",
          borderColor: "rgba(250,204,21,0.15)",
        }}
      />

      {/* Pulse rings */}
      <div
        className="ring"
        style={{
          width: 300,
          height: 300,
          top: "20%",
          left: "20%",
          animationDelay: "0s",
        }}
      />
      <div
        className="ring"
        style={{
          width: 200,
          height: 200,
          top: "50%",
          left: "35%",
          animationDelay: "1.5s",
        }}
      />

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div style={{ maxWidth: 480, width: "100%" }}>
          {/* Logo / Brand */}
          <div
            style={{
              marginBottom: 60,
              animation: "fade-up 0.6s ease forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 4,
                    color: "#dc2626",
                    textTransform: "uppercase",
                    fontFamily: "DM Mono",
                  }}
                >
                  Sistema
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 4,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    fontFamily: "DM Mono",
                  }}
                >
                  Universitario
                </div>
              </div>
            </div>

            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: 72,
                color: "#ffffff",
                lineHeight: 0.9,
                letterSpacing: 2,
              }}
            >
              OptiU
              <br />
              <span style={{ color: "#dc2626" }}></span>
            </h1>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ height: 1, width: 40, background: "#facc15" }} />
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontFamily: "DM Mono",
                }}
              >
                Gestión inteligente de campus
              </span>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              animation: "fade-up 0.6s ease 0.2s forwards",
              opacity: 0,
            }}
          >
            {[
              { val: "94%", label: "Ocupación óptima" },
              { val: "247", label: "Espacios activos" },
              { val: "12K", label: "Reservas/mes" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: 28,
                    color: "#facc15",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tag */}
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 16,
              animation: "fade-up 0.6s ease 0.4s forwards",
              opacity: 0,
            }}
          >
            <div className="corner-tag">v2.4.1</div>
            <div
              style={{
                height: 1,
                flex: 1,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div className="corner-tag">
              <span style={{ color: "#facc15" }}>●</span> Sistema en línea
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div style={{ width: "100%", maxWidth: 360 }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 4,
                color: "#dc2626",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Acceso al sistema
            </div>
            <h2
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: 42,
                color: "#0a0a0a",
                lineHeight: 1,
                letterSpacing: 1,
              }}
            >
              INICIAR
              <br />
              SESIÓN
              <span className="cursor" />
            </h2>
            <p
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
                lineHeight: 1.7,
                fontFamily: "DM Mono",
              }}
            >
              Accede con tus credenciales institucionales para gestionar los
              espacios del campus.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div className="input-wrap">
              <label className="label">Correo institucional</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="usuario@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 2,
                    background: "#dc2626",
                    transition: "width 0.3s",
                    width: focused === "email" ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <div className="input-wrap">
              <label className="label">Contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 2,
                    background: "#dc2626",
                    transition: "width 0.3s",
                    width: focused === "pass" ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            {/* Forgot */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -8,
              }}
            >
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#dc2626",
                  fontFamily: "DM Mono",
                  letterSpacing: 1,
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecorationColor = "#dc2626")
                }
                onMouseOut={(e) =>
                  (e.target.style.textDecorationColor = "transparent")
                }
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <span className="loading-dots">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                "INGRESAR"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 2 }}>
              SSO
            </span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          {/* SSO button */}
          <button
            type="button"
            style={{
              marginTop: 16,
              width: "100%",
              padding: "13px 16px",
              background: "transparent",
              border: "1.5px solid #e5e7eb",
              fontFamily: "DM Mono",
              fontSize: 12,
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              letterSpacing: 1,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#dc2626";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#374151";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Acceso con cuenta institucional
          </button>

          {/* Footer note */}
          <div
            style={{
              marginTop: 32,
              padding: "12px 16px",
              background: "#fef9c3",
              borderLeft: "3px solid #facc15",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#713f12",
                letterSpacing: 0.5,
                lineHeight: 1.6,
                fontFamily: "DM Mono",
              }}
            >
              Solo usuarios autorizados. Accesos no autorizados están sujetos a
              sanciones institucionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
