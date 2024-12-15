/**
 * Formats a date string into a specified format.
 *
 * @param {string} dateString - The ISO date string to format.
 * @param {string} format - The desired format ('long', 'short', 'custom', or 'dateOnly').
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateString, format = 'long') {
  const date = new Date(dateString)

  switch (format) {
    case 'long':
      // Example: November 13, 2024, 6:11:41 AM
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      })

    case 'short':
      // Example: 13/11/2024, 06:11
      return date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

    case 'custom':
      // Example: 2024-11-13 06:11:41
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
        2,
        '0'
      )} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
        date.getSeconds()
      ).padStart(2, '0')}`

    case 'dateOnly':
      // Example: 13 November 2024
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

    default:
      // Fallback to ISO string if format is invalid
      return date.toISOString()
  }
}
