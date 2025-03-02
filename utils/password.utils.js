import bcrypt from 'bcrypt';

const saltRounds = 10;// Thay cai nay neu can, nho can bang giua bao mat & performance

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};