import fs from "fs";
import path from "path";
import Content from "../models/contents.model.js";
import { error } from "console";

export async function getBannerImagePath(traceId) {
    try{
        let storageRecord = await Content.findOne({_id: traceId})
        console.log(storageRecord)
        const dirPath = path.join(process.cwd(), "temporaryStorage", "stories");
        const actualFilePath = path.join(dirPath, storageRecord.fileName)
        if(!fs.existsSync(actualFilePath)){
            throw error(`Error, can't find the requested file with trace id: ${traceId}`)
        }
        console.log("Extracted file path:", actualFilePath)
        return String(actualFilePath)
    }catch(err){
        console.log("There's an error while resolve cdn get banner:", err)
        return err
    }

}

export async function getComicImagePath(traceId){
    try{
        let storageRecord = await Content.findOne({_id: traceId})
        console.log(storageRecord)
        const dirPath = path.join(process.cwd(), "temporaryStorage", "chapterComic");
        const actualFilePath = path.join(dirPath, storageRecord.fileName)
        if(!fs.existsSync(actualFilePath)){
            throw error(`Error, can't find the requested file with trace id: ${traceId}`)
        }
        console.log("Extracted file path:", actualFilePath)
        return String(actualFilePath)
    }catch(err){
        console.log("There's an error while resolve cdn get banner:", err)
        return err
    }
}