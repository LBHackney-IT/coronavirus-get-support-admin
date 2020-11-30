const convertDate = dateString => {
  let theDate = {
    day: "",
    month: "",
    year: "",
    concatenated: ""
  };

  const newDate = new Date(dateString);

  theDate.day = newDate.getDate();
  theDate.month = newDate.getMonth() + 1;
  theDate.year = newDate.getFullYear();

  if (theDate.day < 10) theDate.day = "0" + theDate.day;
  if (theDate.month < 10) theDate.month = "0" + theDate.month;

  theDate.concatenated = [theDate.day, theDate.month, theDate.year].join("/");

  return theDate;
};
const convertNoteDate = dateString => {
  var options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };
  return new Date(dateString).toLocaleTimeString("en-us", options);
};

module.exports = {
  convertDate,
  convertNoteDate
};
