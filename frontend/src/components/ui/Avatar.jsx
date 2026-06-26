const avatarColors = { AK: "#3B82F6", SR: "#8B5CF6", ML: "#10B981", JP: "#F59E0B", DF: "#3B82F6" };

export function Avatar({ initials = "DF", size = 20 }) {
  const color = avatarColors[initials] || avatarColors.DF;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
