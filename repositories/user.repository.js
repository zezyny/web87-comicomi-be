import User from "../models/user.model.js"

const userRepository = {
    getAndPaginateUser: async ({ keyword, page, pageSize, orderBy, orderDirection }) => {
        const query = {}
        if (keyword) {
            query.userName = { $regex: new RegExp('.*' + keyword + '.*', 'i') }
        }

        const totalUsers = await User.countDocuments(query)

        const totalPages = Math.ceil(totalUsers / pageSize)

        const sort = {}
        sort[orderBy] = orderDirection == 'asc' ? 1 : -1

        const users = await User.find(query, {}, {
            limit: pageSize,
            skip: (page - 1) * pageSize,
            sort: sort
        })


        return { total: totalUsers, totalPages: totalPages, users }
    },

    getUserById: async (id) => {
        const user = await User.findById(id)
        return user
    },
    getAllUsers: async () => {
        const users = await User.find()
        return users
    }
}

export default userRepository