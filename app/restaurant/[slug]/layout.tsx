import Header2 from "../../components/Header2";

const RestaurantPageslayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  return (
    <>
      <Header2 title={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start -mt-11">
        {children}
      </div>
    </>
  );
};

export default RestaurantPageslayout;
