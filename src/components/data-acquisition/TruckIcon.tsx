import { motion } from "framer-motion";

const TruckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <ellipse cx="32" cy="30" rx="26" ry="2" fill="currentColor" opacity="0.1" />
    <rect x="2" y="6" width="30" height="18" rx="3" fill="currentColor" />
    <rect x="4" y="8" width="26" height="14" rx="1.5" fill="currentColor" opacity="0.85" />
    <line x1="12" y1="8" x2="12" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="20" y1="8" x2="20" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <rect x="11" y="11" width="10" height="8" rx="1" fill="hsl(var(--background))" opacity="0.25" />
    <line x1="16" y1="11" x2="16" y2="19" stroke="hsl(var(--background))" strokeWidth="0.5" opacity="0.35" />
    <line x1="11" y1="15" x2="21" y2="15" stroke="hsl(var(--background))" strokeWidth="0.5" opacity="0.35" />
    <path d="M32 10 L32 24 L50 24 L50 16 L44 10 Z" fill="currentColor" opacity="0.9" />
    <path d="M33 11 L43 11 L48 16 L33 16 Z" fill="hsl(var(--background))" opacity="0.15" />
    <path d="M35 12 L42 12 L46 16 L35 16 Z" fill="hsl(var(--background))" opacity="0.5" />
    <path d="M36 12.5 L39 12.5 L41 15 L36 15 Z" fill="hsl(var(--background))" opacity="0.3" />
    <line x1="38" y1="16" x2="38" y2="23" stroke="hsl(var(--background))" strokeWidth="0.5" opacity="0.2" />
    <rect x="39" y="19" width="2.5" height="0.8" rx="0.4" fill="hsl(var(--background))" opacity="0.3" />
    <rect x="49" y="18" width="3" height="6" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="50" y="18" width="2" height="2.5" rx="0.5" fill="#FBBF24" />
    <circle cx="53" cy="19" r="3" fill="#FBBF24" opacity="0.15" />
    <rect x="2" y="20" width="1.5" height="2" rx="0.5" fill="#EF4444" opacity="0.8" />
    <circle cx="43" cy="26" r="4" fill="hsl(var(--foreground))" opacity="0.75" />
    <circle cx="43" cy="26" r="2.5" fill="hsl(var(--muted))" opacity="0.5" />
    <circle cx="43" cy="26" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
    <circle cx="13" cy="26" r="4" fill="hsl(var(--foreground))" opacity="0.75" />
    <circle cx="13" cy="26" r="2.5" fill="hsl(var(--muted))" opacity="0.5" />
    <circle cx="13" cy="26" r="1" fill="hsl(var(--foreground))" opacity="0.4" />
    <rect x="8" y="24" width="1" height="3" rx="0.3" fill="currentColor" opacity="0.4" />
    <rect x="38" y="24" width="1" height="3" rx="0.3" fill="currentColor" opacity="0.4" />
  </svg>
);

export const AnimatedTruck = ({ colorClass = "text-primary" }: { colorClass?: string }) => (
  <div className="relative">
    <div className="absolute -left-5 top-1">
      <motion.div
        className="w-2 h-2 rounded-full bg-muted-foreground/20"
        animate={{ x: [-2, -14], y: [0, -4], opacity: [0.4, 0], scale: [0.5, 1.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1 w-1.5 h-1.5 rounded-full bg-muted-foreground/15"
        animate={{ x: [-2, -10], y: [2, -2], opacity: [0.3, 0], scale: [0.4, 1.5] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
      />
      <motion.div
        className="absolute -top-0.5 w-1 h-1 rounded-full bg-muted-foreground/10"
        animate={{ x: [0, -12], y: [1, -6], opacity: [0.3, 0], scale: [0.3, 2] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
      />
    </div>
    <motion.div
      className="absolute -left-8 top-3 w-4 h-[1px] bg-muted-foreground/20 rounded"
      animate={{ opacity: [0, 0.3, 0], x: [-4, -10] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
    />
    <motion.div
      className="absolute -left-6 top-5 w-3 h-[1px] bg-muted-foreground/15 rounded"
      animate={{ opacity: [0, 0.2, 0], x: [-2, -8] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
    />
    <motion.div animate={{ y: [0, -1.5, 0, -0.5, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
      <TruckIcon className={`w-24 h-10 ${colorClass} drop-shadow-md transition-colors duration-700`} />
    </motion.div>
    <motion.div
      className="absolute -left-2 bottom-0 w-1 h-1 rounded-full bg-muted-foreground/20"
      animate={{ x: [-2, -8], y: [0, -3], opacity: [0.3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
  </div>
);

export default TruckIcon;
