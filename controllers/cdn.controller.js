import Chapter from "../models/chapter.model.js";
import Content from "../models/contents.model.js";
import Story from "../models/story.model.js";
import { getBannerImagePath } from "../utils/getFile.utils.js";

export const resolveBannerGet = async (req, res) => {
    try{
        const { traceId } = req.params
        console.log("Resolve image get for:", traceId)
        const imagePath = await getBannerImagePath(traceId)
        res.status(200).sendFile(imagePath)
    }catch(err){
        console.log("There's an error when trying to resolve:", err)
        res.status(404).json({Message:"Image not found."})
    }
    
}