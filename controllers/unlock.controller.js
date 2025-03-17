import mongoose from "mongoose";
import Unlock from "../models/unlock.model.js";

export const getUnlockByCreatorId = async (req, res) => {
    try {
        const {
            creatorId,
            period,
            page = 1,
            limit = 10,
            sortBy = 'date',
            sortDirection = 'asc'
        } = req.query;

        // Validate input
        if (!creatorId || !period) {
            return res.status(400).json({ message: 'Missing required parameter' });
        }

        const dateFormats = {
            day: '%Y-%m-%d',
            week: '%Y-%U',
            month: '%Y-%m'
        };

        const mainPipeline = [
            {
                $lookup: {
                    from: 'stories',
                    localField: 'storyId',
                    foreignField: '_id',
                    as: 'story'
                }
            },
            { $unwind: '$story' },
            {
                $match: {
                    'story.creatorId': new mongoose.Types.ObjectId(creatorId)
                }
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transactionId',
                    foreignField: '_id',
                    as: 'transaction'
                }
            },
            { $unwind: '$transaction' },
            {
                $match: {
                    'transaction.transactionType': 'unlock'
                }
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: dateFormats[period],
                                date: '$transaction.date'
                            }
                        },
                        ...(period === 'week' ? { // Thêm điều kiện cho week
                            week: {
                                $dateToString: {
                                    format: "%Y-%U",
                                    date: "$transaction.date"
                                }
                            },
                            startDate: { $min: "$transaction.date" },
                            endDate: { $max: "$transaction.date" }
                        } : {})
                    },
                    total: { $sum: "$transaction.amount" },
                    transactions: { $push: "$$ROOT.transaction" },
                    storyNames: { $push: "$story.title" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date", // Giữ lại trường date
                    ...(period === 'week' ? { // Thêm điều kiện cho week
                        week: "$_id.week",
                        startDate: "$_id.startDate",
                        endDate: "$_id.endDate"
                    } : {}),
                    total: 1,
                    transactions: 1,
                    storyNames: 1
                }
            }
        ];

        // Pipeline phân trang
        const paginationPipeline = [
            ...mainPipeline,
            { $sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ];

        // Pipeline đếm tổng
        const countPipeline = [
            ...mainPipeline,
            { $count: 'totalItems' }
        ];

        const [data, countResult] = await Promise.all([
            Unlock.aggregate(paginationPipeline),
            Unlock.aggregate(countPipeline)
        ]);

        const totalItems = countResult[0]?.totalItems || 0;

        res.json({
            success: true,
            data,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
