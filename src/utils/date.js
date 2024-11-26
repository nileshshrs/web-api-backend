export const oneDayFromNow = () => new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours * 60 minutes * 60 seconds * 1000 ms

export const fifteenDaysFromNow = () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days * 60 minutes * 60 seconds * 1000 ms

export const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes * 60 seconds * 1000 ms

export const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 minutes * 60 seconds

export const oneHourFromNow = () => new Date(Date.now() + 60 * 60  * 1000); // 60 minutes * 60