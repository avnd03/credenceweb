import React, { useState, useEffect } from 'react';
import TestimonialCard from '../common/TestimonialCard';
import { testimonialsAPI } from '../../services/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialsAPI.getApproved();
        setTestimonials(res.data.data.slice(0, 6));
      } catch (error) {
        console.error('Error:', error);
        // Fallback data
        setTestimonials([
          { id: 1, name: 'Rahul Sharma', location: 'Mumbai', rating: 5, review: 'Amazing experience with Credence Holidays! The Goa trip was perfectly organized. Will definitely book again.' },
          { id: 2, name: 'Priya Patel', location: 'Delhi', rating: 5, review: 'Our honeymoon in Maldives was a dream come true. Thank you Credence Holidays for making it so special!' },
          { id: 3, name: 'Amit Kumar', location: 'Bangalore', rating: 4, review: 'The Rajasthan tour was incredible. Great hotels, knowledgeable guide, and seamless transfers. Highly recommended.' },
        ]);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">What Our Travelers Say</h2>
        <p className="section-subtitle">
          Real experiences from real travelers who explored the world with us
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
