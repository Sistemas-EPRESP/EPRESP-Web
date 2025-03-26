export default function Logo({ width = 80, height = 80, className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path d="M25 127L57 71.5744H121L153 127L121 182.426H57L25 127Z" fill="#00FF00" />
        <path d="M101 183L133 127.574H197L229 183L197 238.426H133L101 183Z" fill="#FFFF00" />
        <path d="M101 72L133 16.5744H197L229 72L197 127.426H133L101 72Z" fill="#0066FF" fillOpacity="0.8" />
        <path d="M25 127L57 71.5744L121 71.5744L153 127L121 182.426H57L25 127Z" fill="#00FF00" fillOpacity="0.5025" />
      </svg>
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider drop-shadow-sm">EPRESP</h1>
        <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xs md:max-w-none">
          Ente Regulador de Servicios Públicos de la Provincia de Chubut
        </p>
      </div>
    </div>
  );
}
