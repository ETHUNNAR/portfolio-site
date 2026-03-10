import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Vi The Ngo - Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(199, 125, 78, 0.15)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "250px",
            height: "250px",
            background: "rgba(199, 125, 78, 0.1)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              padding: "8px 20px",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "#999", fontSize: "18px" }}>
              Odense, Denmark
            </span>
          </div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Vi The
            </span>
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #c77d4e, #e8a673)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Ngo
            </span>
          </div>
          <span
            style={{
              fontSize: "28px",
              color: "#999",
              fontWeight: 300,
            }}
          >
            Software Developer
          </span>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "40px",
            }}
          >
            {["React", "TypeScript", "Angular", "Next.js", "Full-Stack"].map(
              (skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "6px 16px",
                    background: "rgba(199, 125, 78, 0.1)",
                    border: "1px solid rgba(199, 125, 78, 0.3)",
                    borderRadius: "8px",
                    color: "#e8a673",
                    fontSize: "16px",
                  }}
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
