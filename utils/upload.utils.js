import fs from "fs";
import path from "path";
import { parse } from 'node-html-parser'; 

//Updated from XML save, for complaitable with HTML.


const disallowedTags = ["script", "link", "iframe", "style", "object", "embed"];


function containsDisallowedTags(xmlData) {
    const regex = new RegExp(`<(${disallowedTags.join("|")})\\b`, "i"); 
    return regex.test(xmlData);
}

async function saveXMLData(xmlData, chapterId) {
    try {
        const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterNovel");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `${chapterId}.xml`); 
        await fs.promises.writeFile(filePath, xmlData, "utf8");
        console.log(`Content saved successfully at ${filePath}`); 
        return `${chapterId}.xml`
    } catch (error) {
        console.error("Error saving content file:", error); 
        throw new Error("Failed to save content data."); 
    }
}

export async function processXMLData(xmlData, chapterId) { 
    if (!xmlData || typeof xmlData !== "string") {
        throw new Error("Invalid or missing content body."); 
    }

    try {
        parse(xmlData);
    } catch (error) {
        console.warn("Warning: HTML parsing encountered issues, but proceeding. Content might be slightly malformed.");
    }


    if (containsDisallowedTags(xmlData)) {
        throw new Error("Content contains disallowed tags for security.");
    }
    let savedAt = await saveXMLData(xmlData, chapterId);
    return {fileAt: savedAt};
}