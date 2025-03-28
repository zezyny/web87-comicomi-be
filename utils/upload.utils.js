import fs from "fs";
import path from "path";
import { parse } from 'node-html-parser';
import Chapter from "../models/chapter.model.js";
import Content from "../models/contents.model.js";
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

export const ClearOldContent = async (chapterId) => {
    //flow: clear all content file, then drop content in server by isDeleted = true.
    try{
        const chapterData = await Chapter.findById(chapterId);
        chapterData.content.forEach(async (e, ind) => {
            const contentRecord = await Content.findById(e)
            const toDelete = contentRecord.fileName
            if(chapterData.type == "comic"){
                const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterComic");
                const filePath = path.join(dirPath, toDelete);
                console.log("Deleting:", filePath)
                await fs.promises.rm(filePath)
            }
        })
        await Chapter.findByIdAndUpdate(chapterData, {$set:{content: []}}) // clear content
        console.log("Updated chapter:", await Chapter.findById(chapterId))
        await Content.updateMany({chapterId: chapterId, isDeleted: false}, {isDeleted:true});
        console.log("Soft deleted content:", await Content.find({chapterId: chapterId, isDeleted:true}))
        console.log("Successful.")
    }catch (err){
        console.log("Error occur when trying to remove content:", err);
        return err;
    }
}

export async function processImage(imageFile, chapterId) {
    //Security is very very low in this ver.
    // if()
    if (
        imageFile.originalname.toLowerCase().endsWith('.heic') ||
        imageFile.originalname.toLowerCase().endsWith('.png') ||
        imageFile.originalname.toLowerCase().endsWith('.jpg') ||
        imageFile.originalname.toLowerCase().endsWith('.jpeg')
    ) {
        // console.log(imageFile)

        const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterComic", String(chapterId));
        const fname = `${chapterId}${Date.now()}${imageFile.originalname}`.trim().toLocaleLowerCase()
        const filePath = path.join(dirPath, fname);
        console.log("Will save to:", filePath)
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath)
            }
            await fs.promises.writeFile(filePath, imageFile.buffer)
            console.log("Saved image to server.")
            return path.join(String(chapterId), fname);
        } catch (err) {
            throw err
        }
    } else {
        throw error("Error: Security risks - unknown file type uploaded - halted.")
    }
}

export async function uploadBannerImage(imageFile, chapterId) {
    if (
        imageFile.originalname.toLowerCase().endsWith('.heic') ||
        imageFile.originalname.toLowerCase().endsWith('.png') ||
        imageFile.originalname.toLowerCase().endsWith('.jpg') ||
        imageFile.originalname.toLowerCase().endsWith('.jpeg')
    ) {
        const dirPath = path.join(process.cwd(), "temporaryStorage", "stories", String(chapterId), "bannerImage");
        const fname = `${chapterId}${Date.now()}${imageFile.originalname}`.trim().toLocaleLowerCase()
        const filePath = path.join(dirPath, fname);
        console.log("Will save to:", filePath)
        try {
            let StoriesStoragePath = path.join(process.cwd(), "temporaryStorage", "stories", String(chapterId))
            if (!fs.existsSync(StoriesStoragePath)) {
                fs.mkdirSync(StoriesStoragePath)
            }
            if(!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath)
            }
            await fs.promises.writeFile(filePath, imageFile.buffer)
            console.log("Saved image to server.")
            return path.join(String(chapterId), "bannerImage", fname);
        } catch (err) {
            throw err
        }
    } else {
        throw error("Error: Security risks - unknown file type uploaded - halted.")
    }
}
