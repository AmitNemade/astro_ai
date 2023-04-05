export const classNames = (...args) => {
  return args
    .map((arg) => {
      if (typeof arg === "string" || typeof arg === "number") return arg;
      return "";
    })
    .join(" ");
};
