import { Item } from "@prisma/client";

const MenuCard = ({ menuItem }: { menuItem: Item }) => {
  return (
    <div className="bg-gray-50 border rounded p-3 mb-3 w-[49%]">
      <h3 className="font-bold text-lg">{menuItem.name}</h3>
      <p className="mt-1 text-sm leading-5">{menuItem.description}</p>
      <p className="mt-7">{menuItem.price}</p>
    </div>
  );
};

export default MenuCard;
