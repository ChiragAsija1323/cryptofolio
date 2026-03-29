import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

function InteractiveCoin() {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [explode, setExplode] = useState(false);

  // Mouse rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth spring physics
  const smoothX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  // Idle auto spin
  const idleSpin = {
    rotateY: 360,
    transition: {
      repeat: Infinity,
      duration: 8,
      ease: "linear",
    },
  };

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    rotateY.set(deltaX / 12);
    rotateX.set(-deltaY / 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = prev + (e.deltaY < 0 ? 0.1 : -0.1);
      return Math.min(Math.max(newZoom, 0.8), 1.8);
    });
  };

  const handleClick = () => {
    setExplode(true);
    setTimeout(() => setExplode(false), 600);
  };

  return (
    <div
      style={{
        perspective: 1200,
        display: "flex",
        justifyContent: "center",
        margin: "50px 0",
      }}
      onWheel={handleWheel}
    >
      <motion.div
        ref={ref}
        drag
        dragElastic={0.6}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 40px #facc15",
        }}
        whileTap={{ scale: 0.95, rotateY: 180 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={idleSpin}
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #facc15, #f59e0b)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.4), inset 0 0 25px rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "50px",
          fontWeight: "bold",
          color: "#111",
          cursor: "grab",
          rotateX: smoothX,
          rotateY: smoothY,
          scale: zoom,
        }}
      >
        ₿
      </motion.div>

      {/* Explosion Effect */}
      <AnimatePresence>
        {explode && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, #facc15 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractiveCoin;