import { motion } from "framer-motion"
import { HandshakeIcon } from "lucide-react"

export function BondLoadingModal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-r from-[#cdffd8]/80 to-[#94b9ff]/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Orbital Circles */}
        <motion.div
          className="absolute w-32 h-32 border-2 border-[#0066FF] rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-24 h-24 border-2 border-[#94b9ff] rounded-full"
          animate={{
            rotate: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Central Icon */}
        <motion.div
          className="flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <HandshakeIcon className="w-12 h-12 text-[#0066FF]" />
        </motion.div>

        {/* Pulsing Background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#0066FF]/10"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Loading Text */}
      <motion.p
        className="absolute bottom-20 text-lg font-semibold text-[#0066FF]"
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        Establishing Trust...
      </motion.p>
    </motion.div>
  )
}