export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '-'
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value
  if (isNaN(numValue)) return '-'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(numValue)
} 