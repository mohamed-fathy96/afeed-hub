export const formatCurrency = (amount: number) => {
  return `${amount?.toLocaleString()} KD`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
