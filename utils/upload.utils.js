import fs from "fs";
import path from "path";
import { parse } from 'node-html-parser';
// import { error, timeStamp } from "console";
// import { randomUUID } from "crypto";

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
    return { fileAt: savedAt };
}

export async function processImage(imageFile, chapterId) {
    //Security is very very low in this ver.
    // if()
    if(
        imageFile.originalname.toLowerCase().endsWith('.heic') ||
        imageFile.originalname.toLowerCase().endsWith('.png') ||
        imageFile.originalname.toLowerCase().endsWith('.jpg') ||
        imageFile.originalname.toLowerCase().endsWith('.jpeg')
    ){
        // console.log(imageFile)
        const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterComic");
        const fname = `${chapterId}${Date.now()}${imageFile.originalname}`.trim().toLocaleLowerCase()
        const filePath = path.join(dirPath, fname);
        console.log("Will save to:", filePath)
        try{
            await fs.promises.writeFile(filePath, imageFile.buffer)
            console.log("Saved image to server.")
            return fname;
        }catch(err){
            throw err
        }
    }else{
        throw error("Error: Security risks - unknown file type uploaded - halted.")
    }

        

}