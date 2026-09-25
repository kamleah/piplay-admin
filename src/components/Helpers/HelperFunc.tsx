export const bookingTestNameHandler = (userDetailsA, id: any) => {
  const user = userDetailsA?.filter((itw: any) => {
    return itw.userId === id;
  });
  return user[0];
};
export const formatTimeWithTestTimeStamp = (timeString, withAMPM) => {
  let hourString = timeString.split(":")[0];
  let minute = timeString.split(":")[1];
  const hour = +hourString % 24;
  if (withAMPM) {
    return (hour % 12 || 12) + ":" + minute + " " + (hour < 12 ? "AM" : "PM");
  } else {
    return (hour % 12 || 12) + ":" + minute;
  }
};
export const getTestDateString = (date, startTime, endTime) => {
  const tempDate = new Date(date);
  return (
    tempDate.toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }) +
    " , " +
    formatTimeWithTestTimeStamp(startTime, false) +
    " - " +
    formatTimeWithTestTimeStamp(endTime, true)
  );
};