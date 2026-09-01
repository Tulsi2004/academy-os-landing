import { ImageResponse } from "next/og";

export const alt = "Academy OS — Run your academy from one calm dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fffcf9",
          color: "#241b3a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 34,
            fontWeight: 800,
            color: "#6754bd",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#6754bd",
            }}
          />
          Academy OS
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 58, fontWeight: 800, lineHeight: 1.15, maxWidth: 980 }}>
          Run your academy from one calm dashboard.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#6b6280", maxWidth: 900 }}>
          Enquiries, students, batches, fees and attendance — all in one place.
        </div>
      </div>
    ),
    { ...size }
  );
}
