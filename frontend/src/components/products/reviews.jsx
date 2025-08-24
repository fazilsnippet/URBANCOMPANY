
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetReviewsQuery, useAddReviewMutation, useDeleteReviewMutation } from '../../features/review/reviewApi';
import { StarIcon } from '@heroicons/react/24/solid';

export default function Reviews({ productId }) {
  const { user } = useSelector((s) => s.auth);
  const { data: reviews = [] } = useGetReviewsQuery(productId);
  const [addReview] = useAddReviewMutation();
  const [delReview] = useDeleteReviewMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submit = async () => {
    if (!user) return;
    await addReview({ productId, rating, comment });
    setComment('');
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Reviews</h3>
      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="p-3 bg-base-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-medium">{r.user?.name}</div>
                <div className="flex">{Array.from({ length: r.rating }).map((_,i)=><StarIcon key={i} className="w-4 h-4 text-yellow-400" />)}</div>
              </div>
              {user?.id === r.userId && (
                <button className="btn btn-ghost btn-xs" onClick={()=>delReview({ productId, reviewId: r.id })}>Delete</button>
              )}
            </div>
            <p className="text-sm mt-1">{r.comment}</p>
          </div>
        ))}
      </div>

      {user && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span>Rate:</span>
            <select className="select select-bordered select-sm" value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map((n)=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <textarea className="textarea textarea-bordered w-full mt-2" placeholder="Share your experience..." value={comment} onChange={(e)=>setComment(e.target.value)} />
          <button className="btn btn-primary mt-2" onClick={submit}>Submit Review</button>
        </div>
      )}
    </div>
  );
}
