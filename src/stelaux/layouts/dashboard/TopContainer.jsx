const CardGrid = ({ children }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-80 lg:h-52">
        {children}
      </div>
    );
  };

export default CardGrid