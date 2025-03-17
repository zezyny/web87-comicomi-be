import favoriteRepository from "../repositories/favorite.repository.js"

export const getListByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Validate userId
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Get favorite stories list for the user
        const favoriteData = await favoriteRepository.getListByUserId(userId);
        if (!favoriteData || favoriteData.favoriteList.length === 0) {
            return res.status(404).json({
                message: "No favorite list found for this user",
                data: {
                    favorites: [],
                    pagination: {
                        currentPage: page,
                        totalPages: 0,
                        totalItems: 0,
                        limit: limit
                    }
                }
            });
        }
        const formattedResult = favoriteData.favoriteList.map(favorite => ({
            id: favorite.storyId._id,
            title: favorite.storyId.title,
            author: favorite.storyId.author,
            creator: favorite.storyId.creatorId,
            img: favorite.storyId.img,
            type: favorite.storyId.type,
            genre: favorite.storyId.genre,
            status: favorite.storyId.status,
            description: favorite.storyId.description,
            release: favorite.storyId.release,
            addedToFavoriteDate: favorite.date
        }));
        console.log(formattedResult);
        const totalFavorites = formattedResult.length
        const totalPages = Math.ceil(totalFavorites / limit);
        // Return the result
        return res.ok({
            favorites: formattedResult,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalFavorites,
                limit: limit
            }
        });
    } catch (error) {
        console.error("Error fetching favorite stories:", error);
        return res.status(500).json({
            message: "Failed to fetch favorite stories",
            error: error.message
        });
    }
}

export const addToFavorite = async(req, res) => {
    //... logic here.
}