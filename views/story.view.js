export const StoryView = function (story) {
    const dt = {
        id: story.id,
        title: story.title,
        author: story.author,
        creatorId: story.creatorId,
        type: story.type,
        genre: story.genre,
        status: story.status,
        description: story.description,
        release: story.release,
        lastUpdate: story.lastUpdate
    }

    if (story.user) {
        dt.creatorName = story.user.userName
    }
    return dt
}

export const StoryListView = function (stories) {
    return stories.map(story => StoryView(story))
}