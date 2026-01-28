const sanitizeHtml = require("sanitize-html");
const { JSDOM } = require("jsdom");

function validateAndCleanHTML(html) {
  if (typeof html !== "string") {
    throw new Error("El HTML debe ser un string");
  }

  // Sanitizar
  const clean = sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "font"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      p: ["class"],
      font: ["face", "size", "color"],
    },
  });

  // Validar que sea HTML real
  const dom = new JSDOM(clean);
  const hasContent = dom.window.document.body.children.length > 0;

  if (!hasContent) {
    throw new Error("El contenido no es HTML válido");
  }

  return clean;
}

module.exports = validateAndCleanHTML;
