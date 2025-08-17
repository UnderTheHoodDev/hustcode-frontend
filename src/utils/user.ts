const getUserInitials = (name: string | undefined) => {
  if (!name) return 'A';

  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export { getUserInitials };
