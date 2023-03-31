import { PrismaClient } from "@prisma/client";
import MenuCard from "../../../components/MenuCard";
import Navbar3 from "../../../components/Navbar3";

const prisma = new PrismaClient();

const fetchRestaurantMenuItems = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: slug },
    select: {
      items: true,
    },
  });

  if (!restaurant) throw new Error();

  return restaurant.items;
};

const RestaurantMenu = async ({ params }: { params: { slug: string } }) => {
  const menuItems = await fetchRestaurantMenuItems(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <Navbar3 slug={params.slug} />
        <main className="bg-white mt-5">
          <div>
            <div className="mt-4 pb-1 mb-1">
              <h1 className="font-bold text-4xl">Menu</h1>
            </div>
            <div className="flex flex-wrap justify-between">
              {menuItems.length ? (
                menuItems.map((menuItem) => (
                  <MenuCard key={menuItem.id} menuItem={menuItem} />
                ))
              ) : (
                <div className="h-96">
                  <p>Menu is not available this restaurant!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RestaurantMenu;
