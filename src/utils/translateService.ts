// Use dynamic import for translate package since it's an ES Module
// This avoids ERR_REQUIRE_ESM error when using require() in CommonJS

const translateToItalian = async (text: string) => {
  try {
    // Dynamic import for ES Module compatibility
    // The translate package is an ES Module, so we must use dynamic import()
    const translateModule = await import("translate");
    // Handle both default export and named export
    const translate = translateModule.default || translateModule;
    const translation = await translate(text, "it");
    return translation;
  } catch (error) {
    console.error("Translation error:", error);
    return text; 
  }
};

export default translateToItalian;