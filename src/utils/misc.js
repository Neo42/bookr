const formatDate = (date) =>
  new Intl.DateTimeFormat('zh-Hans-CN', {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }).format(date)

export {formatDate}
