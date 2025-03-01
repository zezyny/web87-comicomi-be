export const UserView = function (user) {
    return {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        wallet: user.wallet
    };
}

export const UserListView = function (users) {
    return users.map(user => UserView(user))
}