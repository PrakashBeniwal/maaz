export const formatDate = (inputDate) => {
  if (!inputDate) return '';
  const date = new Date(inputDate);
  if (isNaN(date)) return ''; // Handle invalid dates
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

