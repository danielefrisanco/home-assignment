const dateTimeFormats = {
  en: {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    complete: {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      fractionalSecondDigits: 3
    }
  },
  it: {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    complete: {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      fractionalSecondDigits: 3
    }
  }
}
export default dateTimeFormats
