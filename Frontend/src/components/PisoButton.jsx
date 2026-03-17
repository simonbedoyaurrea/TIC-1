function PisoButton({ piso, onClick, activo }) {
  return (
    <button
      onClick={() => onClick(piso)}
      className={`w-full text-left text-white p-2 rounded transition 
        ${activo ? "bg-[#CB282B] font-bold" : "hover:bg-black"}
      `}
    >
      Piso {piso}
    </button>
  );
}

export default PisoButton;