import translate from "translate";

const translateToItalian = async (text:string) => {
  try {
    const translation = await translate(text, "it");
    return translation;
  } catch (error) {
    console.error("Translation error:", error);
    return text; 
  }
};

export default translateToItalian