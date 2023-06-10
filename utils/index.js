const SCOPE = "utils/index.js";
export class ComError extends Error {
  constructor(m) {
    super(m);
    this.name = "ComError";
  }
}

export function debugWarn(scope, message) {
  if (process.env.NODE_ENV !== "production") {
    const error = isString(scope)
      ? new ComError(`[${scope}] ${message}`)
      : scope;
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}

export function addUnit(value, defaultUnit = "px") {
  if (!value) return "";
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`;
  } else if (isString(value)) {
    return value;
  }
  debugWarn(SCOPE, "binding value must be a string or number");
}
export function isNumber(val) { return typeof val === "number" };
export function isString(val) { return typeof val === "string" };
export function isObject(val) { return toString.call(val) === "[object Object]" };

export function isStringNumber(val) {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};

export function isClient() {
  return typeof window !== "undefined"
};
