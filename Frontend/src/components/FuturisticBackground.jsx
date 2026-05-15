import Particles from "react-tsparticles";

export default function FuturisticBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },

        background: {
          color: {
            value: "#050816",
          },
        },

        fpsLimit: 60,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
        },

        particles: {
          number: {
            value: 80,
          },

          color: {
            value: ["#00D9FF", "#0099FF", "#B300FF"],
          },

          links: {
            enable: true,
            color: "#00D9FF",
            distance: 150,
            opacity: 0.2,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.3,
          },

          size: {
            value: { min: 1, max: 3 },
          },
        },

        detectRetina: true,
      }}
    />
  );
}