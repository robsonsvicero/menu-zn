const allowedStyleProperties = new Set([
  "background-color",
  "color",
  "font-size",
  "font-style",
  "font-weight",
  "margin-left",
  "text-align",
  "text-decoration",
  "vertical-align",
]);

const allowedTextAlignValues = new Set(["left", "right", "center", "justify"]);
const allowedFontStyleValues = new Set(["italic", "normal"]);
const allowedFontWeightValues = new Set(["bold", "normal", "bolder", "lighter"]);
const allowedTextDecorationValues = new Set(["underline", "line-through", "none"]);
const allowedVerticalAlignValues = new Set(["sub", "super", "baseline"]);

function isSafeCssColor(value: string) {
  return (
    /^#[0-9a-f]{3,8}$/i.test(value) ||
    /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.test(value) ||
    /^[a-z]+$/i.test(value)
  );
}

function isSafeCssLength(value: string) {
  return /^-?(?:\d+|\d*\.\d+)(?:px|pt|rem|em|%)$/i.test(value);
}

function isSafeStyleValue(property: string, value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized || /url\s*\(|expression\s*\(|javascript:/i.test(normalized)) {
    return false;
  }

  if (property === "color" || property === "background-color") {
    return isSafeCssColor(normalized);
  }

  if (property === "font-size" || property === "margin-left") {
    return isSafeCssLength(normalized);
  }

  if (property === "font-style") {
    return allowedFontStyleValues.has(normalized);
  }

  if (property === "font-weight") {
    return allowedFontWeightValues.has(normalized) || /^[1-9]00$/.test(normalized);
  }

  if (property === "text-align") {
    return allowedTextAlignValues.has(normalized);
  }

  if (property === "text-decoration") {
    return normalized
      .split(/\s+/)
      .every((item) => allowedTextDecorationValues.has(item));
  }

  if (property === "vertical-align") {
    return allowedVerticalAlignValues.has(normalized);
  }

  return false;
}

export function sanitizeStyleAttribute(value: string) {
  return value
    .split(";")
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(":");

      if (separatorIndex === -1) {
        return null;
      }

      const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
      const propertyValue = declaration.slice(separatorIndex + 1).trim();

      if (!allowedStyleProperties.has(property) || !isSafeStyleValue(property, propertyValue)) {
        return null;
      }

      return `${property}: ${propertyValue}`;
    })
    .filter(Boolean)
    .join("; ");
}
