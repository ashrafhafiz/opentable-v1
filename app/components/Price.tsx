import { PRICE } from "@prisma/client";

interface Props {
  price: PRICE;
}

const Price = ({ price }: Props) => {
  const renderPrice = () => {
    if (price === PRICE.CHEAP) {
      return (
        <>
          <span>$$</span>
          <span className="text-gray-400">$$</span>
        </>
      );
    } else if (price === PRICE.REGULAR) {
      return (
        <>
          <span>$$$</span>
          <span className="text-gray-400">$</span>
        </>
      );
    } else if (price === PRICE.EXPENSIVE) {
      return (
        <>
          <span>$$$$</span>
          <span className="text-gray-400"></span>
        </>
      );
    }
  };

  return <p className="flext mr-3">{renderPrice()}</p>;
};

export default Price;
