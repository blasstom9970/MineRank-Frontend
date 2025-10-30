import React from "react";
import type { Review, User } from "../types";
import { StarRating } from "./StarRating";
import { UserIcon } from "./icons";

interface ReviewListProps {
  reviews: Review[];
  users: User[];
}

interface ReviewItemProps {
  id: number;
  user: User;
  rating: number;
  comment: string;
  timestamp: string;
}

function ReviewItem({ id, user, rating, comment, timestamp }: ReviewItemProps) {
  return (
    <div key={id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <UserIcon className="w-5 h-5 text-slate-300" />
          </div>
          <span className="font-bold text-slate-200">
            {user.username}
          </span>
        </div>
        <StarRating rating={rating} />
      </div>
      <p className="text-slate-300">{comment}</p>
      <p className="text-xs text-slate-500 mt-2 text-right">
        {new Date(timestamp).toLocaleDateString()}
      </p>
    </div>
  )
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, users }: ReviewListProps) => {
  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review) => {
          const user = users.find((u) => u.id === review.user);
          <ReviewItem id={review.id} user={user} rating={review.rating} comment={review.comment} timestamp={review.timestamp}/>
        })
      ) : (
        <p className="text-slate-400 bg-slate-800 p-4 rounded-lg"> 
          아직 리뷰가 없습니다. 가장 먼저 리뷰를 작성해보세요!
        </p>
      )}
    </div>
  );
};
