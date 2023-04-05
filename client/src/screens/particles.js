import React from "react";
import Particles from "react-tsparticles";

export const ShowParticles = () => {
  return (
    <Particles
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0,
        },
        particles: {
          number: {
            value: 100,
            limit: 150,
            density: {
              enable: true,
              value_area: 400,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#ffffff",
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: "images/github.svg",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.5,
              sync: false,
            },
          },
          size: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 0.1,
              size_min: 2,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: false,
            straight: true,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },

        retina_detect: true,
        fps_limit: 24,
      }}
    />
  );
};

export default ShowParticles;
