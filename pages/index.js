import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [url, setUrl] = useState(null);
  const [accessCode, setAccessCode] = useState("");
  const [granted, setGranted] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  async function createSession() {
    const res = await fetch("/api/create-session");
    const data = await res.json();
    if (data.embed_url) setUrl(data.embed_url);
  }

  async function checkAccess(e) {
    e.preventDefault();

    const res = await fetch("/api/check-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: accessCode }),
    });

    const data = await res.json();

    if (data.access) {
      setGranted(true);
      setError("");
    } else {
      setError("Incorrect code 😬");
    }
  }

  function fullscreenVM() {
    const iframe = document.getElementById("vmIframe");
    if (iframe.requestFullscreen) iframe.requestFullscreen();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        d: Math.random() * 2,
      });
    }

    let angle = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      particles.forEach((p) => ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2));
      ctx.fill();

      angle += 0.01;

      particles.forEach((p) => {
        p.y += Math.cos(angle + p.d) + 1;
        p.x += Math.sin(angle) * 2;

        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -10;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  if (!granted) {
    return (
      <div style={styles.container}>
        <canvas ref={canvasRef} style={styles.canvas} />
        <h1>Bruhs VMs 🔒</h1>
        <form onSubmit={checkAccess}>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
            style={styles.input}
          />
          <button style={styles.button}>Submit</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <h1>Bruhs VMs 😎</h1>

      <div style={{ marginBottom: "20px" }}>
        <button style={styles.button} onClick={createSession}>
          Start
        </button>
        <button style={styles.button} onClick={fullscreenVM}>
          Fullscreen
        </button>
      </div>

      {url && (
        <iframe
          id="vmIframe"
          src={url}
          style={{
            width: "100%",
            height: "80vh",
            borderRadius: "12px",
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #111, #000)",
    color: "white",
    textAlign: "center",
    padding: "20px",
    position: "relative",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  button: {
    background: "black",
    color: "gray",
    border: "1px solid white",
    padding: "10px 20px",
    borderRadius: "12px",
    margin: "0 10px",
    cursor: "pointer",
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    marginRight: "10px",
  },
};
