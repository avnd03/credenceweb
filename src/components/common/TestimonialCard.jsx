import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={16}
            className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
      <p className="text-gray-600 italic flex-1 mb-4 text-sm leading-relaxed">
        "{testimonial.review}"
      </p>
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-600 font-bold text-lg">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          {testimonial.location && (
            <p className="text-sm text-gray-500">{testimonial.location}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
