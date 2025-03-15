import Chapter from '../models/chapter.model.js';
import { validateChapterData } from '../utils/validation.utils.js';
import { processImage, processXMLData } from '../utils/upload.utils.js';
import Content from '../models/contents.model.js';
import { getNovelContent } from '../utils/requestContent.utils.js';

export const createChapter = async (req, res) => {
    try {
        const { chapterTitle, chargeType, type, storyId, price } = req.body; 

        const chapterData = { chapterTitle, chargeType, type, storyId, price };

        const errors = validateChapterData(chapterData); 
        if (errors) {
            return res.status(400).json({ message: 'Validation errors', errors });
        }

        const uploadAt = new Date();
        const released = false;

        const lastChapter = await Chapter.findOne({ storyId }).sort({ chapterNumber: -1 }).limit(1);
        const chapterNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;

        const newChapter = new Chapter({
            chapterTitle,
            chargeType,
            type,
            storyId,
            chapterNumber,
            uploadAt,
            released,
            price,
            content: [],
            isDeleted: false
        });

        const savedChapter = await newChapter.save();
        res.status(201).json(savedChapter);
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ message: 'Failed to create chapter', error: error.message });
    }
};

export const deleteChapter = async (req, res) => {
    try {
        const chapterId = req.params.id;

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // await Chapter.findByIdAndDelete(chapterId);
        await Chapter.findByIdAndUpdate(chapterId, {isDeleted: true})
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).json({ message: 'Failed to delete chapter', error: error.message });
    }
};

export const updateChapter = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const updates = req.body;

        if (updates.chargeType && !['Free', 'Ads', 'Paid'].includes(updates.chargeType)) {
            return res.status(400).json({ message: 'Invalid chargeType', errors: { chargeType: 'Charge type must be one of: Free, Ads, Paid.' } });
        }
        if (updates.type && !['comic', 'novel'].includes(updates.type)) {
            return res.status(400).json({ message: 'Invalid type', errors: { type: 'Type must be one of: comic, novel.' } });
        }

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updates, { new: true });
        res.status(200).json(updatedChapter);
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).json({ message: 'Failed to update chapter', error: error.message });
    }
};

export const getChapterDetail = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findById(chapterId).select('-content');

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(chapter);
    } catch (error) {
        console.error("Error getting chapter detail:", error);
        res.status(500).json({ message: 'Failed to get chapter detail', error: error.message });
    }
};

export const getChapterContent = async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapter = await Chapter.findById(chapterId).select('content'); 

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.status(200).json(chapter.content); 
    } catch (error) {
        console.error("Error getting chapter content:", error);
        res.status(500).json({ message: 'Failed to get chapter content', error: error.message });
    }
};


export const getAllChaptersOfStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        let { start, stop, search } = req.query;
        let query = { storyId: storyId };
        let options = {};

        if (search) {
            query.chapterTitle = { $regex: search, $options: 'i' }; 
        }

        if (start && stop) {
            const startIndex = parseInt(start);
            const stopIndex = parseInt(stop);
            const limit = stopIndex - startIndex;
            const skip = startIndex;

            options = {
                skip: Math.max(0, skip),
                limit: Math.max(0, limit)
            };
        }

        const chapters = await Chapter.find(query, null, options).sort({ chapterNumber: 1 });
        res.status(200).json(chapters);
    } catch (error) {
        console.error("Error getting chapters for story:", error);
        res.status(500).json({ message: 'Failed to get chapters for story', error: error.message });
    }
};

export const saveNovelChapterContent = async (req, res) => {
    const { chapterId } = req.params;
    const chapterData = req.chapterData;
    const storyData = req.storyData;

    if (!chapterData || chapterData.type !== "novel") {
        return res.status(400).json({ error: "Invalid chapter data or unsupported chapter type." });
    }

    console.log("Handling novel upload.");
    // console.log("Received body:", req.body);

    const chapterContentXML = `<content>${req.body.contents}</content>`

    try {
        const saveResult = await processXMLData(chapterContentXML, chapterId);
        console.log("Saved content at:", saveResult.fileAt);
        const OldRecordAvailable = (await Content.find({fileName: saveResult.fileAt}).countDocuments() > 0)
        if(!OldRecordAvailable){
            let newContentRecord = await Content.create({
                fileName: saveResult.fileAt,
                type: 'novel',
                chapterId: chapterId,
                isDeleted: false
            });
            await Chapter.findOneAndUpdate(
                { _id: chapterId },
                { $set: { content: [newContentRecord._id] } } // Use $set to replace the array
            );
        }else{
            console.log("Old footprint usable, no update.")
        }
        
        
        return res.status(200).json({ message: "Chapter content saved successfully.", savedAt: saveResult.fileAt });

    } catch (error) {
        console.error("Error saving chapter content:", error);
        return res.status(403).json({ error: error.message });
    }
};

export const publishChapter = async (req, res) => {
    const { chapterId } = req.params;
    const chapterData = req.chapterData;
    if (!chapterData) {
        return res.status(400).json({ error: "Invalid chapter data or unsupported chapter type." });
    }
    try{
        await Chapter.findOneAndUpdate({_id: chapterId}, {released: true})
        return res.status(200).json({ message: "Chapter successfully published." });
    }catch(error){
        console.error("Error publishing chapter content:", error);
        return res.status(403).json({ error: error.message });
    }
}

export const requestChapterContentForUser = async (req, res) => {
    const {chapterId} = req.params;
    if(!chapterId){
        return res.status(403);
    }
    try{
        const chapterData = await Chapter.findOne({_id: chapterId, released: true})
        if(chapterData.type == 'novel'){
            const content = chapterData.content[0]
            if(!content){
                return res.status(403).json({ error: "Chapter don't have any content." });
            }
            let actualContent = await Content.findById(content)
            let contentData = await getNovelContent(actualContent.fileName)
            // console.log(contentData)
            if(contentData != -1){
                contentData = contentData.replace("<content>", "")
                contentData = contentData.replace("</content>", "")
                return res.status(200).json({content: contentData})
            }
        }
        return res.status(404).json({error: "Not found."})
    }catch(error){
        console.error("Error getting chapter content:", error);
        return res.status(403).json({ error: "Chapter does not exists / don't have any content." });
    }
    
    
}

export const requestChapterContentForAdminAndCreator = async (req, res) => {
    const {chapterId} = req.params;
    if(!chapterId){
        return res.status(403);
    }
    try{
        const chapterData = req.chapterData
        if(chapterData.type == 'novel'){
            const content = chapterData.content[0]
            if(!content){
                return res.status(403).json({ error: "Chapter don't have any content." });
            }
            let actualContent = await Content.findById(content)
            let contentData = await getNovelContent(actualContent.fileName)
            // console.log(contentData)
            if(contentData != -1){
                contentData = contentData.replace("<content>", "")
                contentData = contentData.replace("</content>", "")
                return res.status(200).json({content: contentData})
            }else{
                return res.status(404).json({error: 'Content not available.'})
            }
        }
        return res.status(404).json({error: "Not found."})
    }catch(error){
        console.error("Error getting chapter content:", error);
        return res.status(403).json({ error: "Chapter does not exists / don't have any content." });
    }
    
    
}

export const saveComicChapterContent = async (req, res) => {
    const chapterData = req.chapterData
    if(!chapterData){
        return res.status(403).json({error: "chapterId is not specified."}) //checkAccess already handled but we need this for further check.
    }
    console.log("Proceed file upload.")
    let footprintArr = []
    try{
        req.files.forEach( async (e) => {
            const fname = await processImage(e, chapterData._id)
            const newContentFootprint = await Content.create({
                fileName: fname,
                type: 'comic',
                chapterId: chapterData._id,
                isDeleted: false
            })
            footprintArr.push(newContentFootprint._id)
        })
        await Chapter.findOneAndUpdate(
            { _id: chapterData._id },
            { $set: { content: footprintArr } } // Use $set to replace the array
        );
        return res.status(200).json({status: "success."})
    }catch(err){
        console.log("Error: ", err, " on upload image.");
        return res.status(403).json({error: err})
    }
    
}