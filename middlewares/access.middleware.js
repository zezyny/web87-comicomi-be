import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import storyRepository from '../repositories/story.repository.js';
import Chapter from '../models/chapter.model.js';

export const checkAccessToEditChapter =  async(req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const { chapterId } = req.params;
    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', '');

    try {
        const chapterData = await Chapter.findById(chapterId)
        if(! chapterData){
            return res.status(404).json({
                "error": "Chapter not found."
            })
        }
        if(chapterData.isDeleted){
            return res.status(403).json({
                "error": "Chapter is deleted."
            })
        }
        const storyData = await storyRepository.getStoryById(chapterData.storyId);
        if(storyData.isDeleted){
            return res.status(403).json({
                "error": "Story is deleted."
            })
        }
        req.chapterData = chapterData
        req.storyData = storyData
        jwt.verify(accessToken, accessTokenSecret);
        const result = jwt.decode(accessToken);
        req.currentUserId = result.userId;
        const user = await userRepository.getUserById(result.userId)
        console.log("[Sensitive action] Verifying for:", user.userName, "\nID:", user._id);
        if (user.role.toLowerCase() == "admin" || user.role.toLowerCase() == "creator") {
            console.log(`Before access check: Authoirzed for ${user.userName} role: ${user.role} to do some sensitive action.`);
            req.user = user;
            if(user.role.toLocaleLowerCase() == "creator"){
                if(storyData.creatorId != user._id){
                    return res.status(401).json({
                        message: "You don't have permission to perform this action."
                    });
                }
                next();
            }else if(user.role.toLocaleLowerCase() == "admin"){
                next();
            }else{
                return res.status(401).json({
                    message: "You don't have permission to perform this action."
                });
            }

        } else {
            console.log(`Authentication Error: Permission error on request for ${user.userName} role: ${user.role} to do some sensitive action.`);

            return res.status(401).json({
                message: "The request was unauthenticated"
            });
        }
    } catch (exception) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }
}