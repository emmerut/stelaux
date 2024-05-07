const CardGrid = ({ children }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[78vh] lg:h-80 w-72 lg:w-[100%]">
        {children}
      </div>
    );
  };

export default CardGrid