// helpers.ts

export function formatCreatedAt(createdAt) {
    // Create a new Date object from the createdAt string
    const date = new Date(createdAt);
  
    // Format the date string as "d/m/y"
    const formattedDate = date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    // Extract day, month, and year
    const [day, month, year] = formattedDate.split('/');
  
    // Concatenate day, month, and year in the desired format
    return `${month}/${day}/${year}`;
  }
  