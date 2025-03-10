
export const validateChapterData = (data) => {
    const errors = {};

    if (!data.chapterTitle) {
        errors.chapterTitle = 'Chapter title is required.';
    }

    if (!data.chargeType) {
        errors.chargeType = 'Charge type is required.';
    } else if (!['Free', 'Ads', 'Paid'].includes(data.chargeType)) {
        errors.chargeType = 'Charge type must be one of: Free, Ads, Paid.';
    }

    if (!data.type) {
        errors.type = 'Type is required.';
    } else if (!['comic', 'novel'].includes(data.type)) {
        errors.type = 'Type must be one of: comic, novel.';
    }

    if (!data.storyId) {
        errors.storyId = 'Story ID is required.';
    }

    if (data.price !== undefined && typeof data.price !== 'number') {
        errors.price = 'Price must be a number.';
    }

    return Object.keys(errors).length > 0 ? errors : null;
};