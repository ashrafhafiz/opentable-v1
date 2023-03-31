const Header2 = ({ title }: { title: string }) => {
  const renderTitle = () => {
    const titleArray = title.split("-");
    titleArray[titleArray.length - 1] = `(${
      titleArray[titleArray.length - 1]
    })`;
    return titleArray.join(" ");
  };
  return (
    <div className="h-96 overflow-hidden">
      <div className="bg-no-repeat bg-cover bg-center bg-[url('https://resizer.otstatic.com/v2/photos/wide-huge/2/26519987.png')] h-full flex justify-center items-center">
        <h1 className="text-7xl text-white capitalize text-shadow text-center">
          {renderTitle()}
        </h1>
      </div>
    </div>
  );
};

export default Header2;
