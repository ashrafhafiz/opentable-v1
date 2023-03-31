import { Review } from "@prisma/client";
import Stars from "./Stars";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border-b pb-7 mb-7">
      <div className="flex">
        <div className="w-[25%] flex flex-col items-center">
          <div className="rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center">
            <h2 className="text-white text-2xl">
              {review.first_name[0]}
              {review.last_name[0]}
            </h2>
          </div>
          <p className="text-sm text-center uppercase">
            {review.first_name} {review.last_name}
          </p>
        </div>
        <div className="ml-10 w-[75%]">
          <div className="flex items-center">
            <div className="flex mr-5">
              <Stars userRating={review.rating} reviews={[]} />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-reg text-light font-light">{review.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
