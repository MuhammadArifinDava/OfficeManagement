import { motion, AnimatePresence } from "framer-motion";

export function Loader3D({ loading }) {
  const faces = [
    { rotate: "rotateY(0deg)", z: "translateZ(48px)" },
    { rotate: "rotateY(90deg)", z: "translateZ(48px)" },
    { rotate: "rotateY(180deg)", z: "translateZ(48px)" },
    { rotate: "rotateY(-90deg)", z: "translateZ(48px)" },
    { rotate: "rotateX(90deg)", z: "translateZ(48px)" },
    { rotate: "rotateX(-90deg)", z: "translateZ(48px)" },
  ];

  const innerFaces = [
    { rotate: "rotateY(0deg)", z: "translateZ(24px)" },
    { rotate: "rotateY(90deg)", z: "translateZ(24px)" },
    { rotate: "rotateY(180deg)", z: "translateZ(24px)" },
    { rotate: "rotateY(-90deg)", z: "translateZ(24px)" },
    { rotate: "rotateX(90deg)", z: "translateZ(24px)" },
    { rotate: "rotateX(-90deg)", z: "translateZ(24px)" },
  ];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ 
            opacity: 0, 
            scale: 1.5, 
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          <div className="relative perspective-1000">
            {/* Outer Wireframe Cube */}
            <motion.div
              className="relative w-24 h-24 preserve-3d"
              animate={{ rotateX: 360, rotateY: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {faces.map((face, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-2 border-white/20 bg-white/5 backdrop-blur-sm"
                  style={{ transform: `${face.rotate} ${face.z}` }}
                />
              ))}
            </motion.div>

            {/* Inner Glowing Cube */}
            <motion.div
              className="absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 preserve-3d"
              animate={{ rotateX: -360, rotateY: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {innerFaces.map((face, i) => (
                <div
                  key={i}
                  className="absolute inset-0 bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ transform: `${face.rotate} ${face.z}` }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
