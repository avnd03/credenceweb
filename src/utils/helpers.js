export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.REACT_APP_API_URL?.replace('/api', '')}${path}`;
};

export const tourTypes = [
  { value: 'domestic', label: 'Domestic', icon: '🏠' },
  { value: 'international', label: 'International', icon: '✈️' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'honeymoon', label: 'Honeymoon', icon: '💑' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'pilgrimage', label: 'Pilgrimage', icon: '🙏' },
  { value: 'cruise', label: 'Cruise', icon: '🚢' },
  { value: 'wildlife', label: 'Wildlife', icon: '🦁' },
];
