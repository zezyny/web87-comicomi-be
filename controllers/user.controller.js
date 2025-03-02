import User from "../models/user.model.js";
import userRepository from "../repositories/user.repository.js";
import { UserListView, UserView } from "../views/user.view.js";

export const getUsers = async (req, res) => {
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
}

export const getAllUsers = async (req, res) => {
    const result = await userRepository.getAllUsers()
    console.log(UserListView(result));
    return res.ok(UserListView(result))

}

export const getUser = async (req, res) => {
    const { id } = req.params

    const user = await userRepository.getUserById(id)

    if (!user) {
        return res.notFound('', 'User was not found')
    }

    return res.ok(UserView(user))
}
