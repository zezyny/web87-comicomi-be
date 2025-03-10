import User from "../models/user.model.js";
import userRepository from "../repositories/user.repository.js";
import { UserListView, UserView } from "../views/user.view.js";

export const getUsers = async (req, res) => {
    try {
        let { keyword, page, pageSize, orderBy, orderDirection } = req.query
        if (!page || page <= 0) page = 1;
        if (!pageSize || pageSize <= 0) pageSize = 15;
        if (!orderBy) orderBy = 'createdAt';
        if (!orderDirection) orderDirection = 'desc';
        const result = await userRepository.getAndPaginateUser(
            { keyword, page, pageSize, orderBy, orderDirection }
        )
        return res.ok({
            ...result,
            users: UserListView(result.users)
        })
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.notFound('', 'Failed to retrieve users')
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const result = await userRepository.getAllUsers();
        return res.ok(UserListView(result));
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.notFound('', 'Failed to retrieve users')
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await userRepository.getUserById(id)

        if (!user) {
            return res.notFound('', 'User was not found')
        }

        return res.ok(UserView(user))
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.notFound('', 'User was not found')
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.badRequest('User ID is required')
        }
        const userExist = await User.findById(id)
        if (!userExist) {
            return res.notFound('', 'User was not found')
        }
        await User.findByIdAndUpdate(id, { isDeleted: true })
        return res.ok('User deleted successfully')
    } catch (error) {
        res.serverError('Error')
    }
}