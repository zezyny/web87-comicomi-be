import Favorite from "../models/favorite.model.js"

const favoriteRepository = {
    getListByUserId: async (userId) => {
        const list = await Favorite.findOne({ userId: userId }).populate({
            path: 'favoriteList.storyId',
            select: 'title author creator description release status genre type img id'
        }).lean()
        return list
    }
}

export default favoriteRepository   