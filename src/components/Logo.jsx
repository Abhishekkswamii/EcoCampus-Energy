const Logo = ({ size = 80 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield Background */}
      <path
        d="M50 5 L90 20 V50 C90 75 70 90 50 95 C30 90 10 75 10 50 V20 Z"
        fill="#1E40AF"
      />

      {/* Leaf Curve */}
      <path
        d="M20 60 C40 50, 60 70, 80 55"
        stroke="#22C55E"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Lightning Bolt */}
      <path
        d="M55 20 L40 50 H55 L45 80 L75 40 H60 L70 20 Z"
        fill="#FACC15"
      />
    </svg>
  );
};

export default Logo;
