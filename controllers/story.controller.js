import storyRepository from "../repositories/story.repository.js";
import { StoryListView, StoryView } from "../views/story.view.js";

export const getStories = async (req, res) => {
    let { keyword, page, pageSize, orderBy, orderDirection } = req.query;

    if (!page || page <= 0) page = 1;
    if (!pageSize || pageSize <= 0) pageSize = 15;
    if (!orderBy) orderBy = 'createdAt';
    if (!orderDirection) orderDirection = 'desc';

    const result = await storyRepository.getAndPaginateStories(
        { keyword, page, pageSize, orderBy, orderDirection },
        ['user']
    );

    return res.ok({
        ...result,
        stories: StoryListView(result.stories)
    });
}

export const getStory = async (req, res) => {
    const { id } = req.params

    const story = await storyRepository.getStoryById(id)
        (await story.populate(['user']))

    if (!story) {
        return res.notFound('', 'Story was not found')
    }

    return res.ok(StoryView(story))
}