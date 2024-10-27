import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const isPasswordValid = async (password: string, storedPassword: string) => {
    return await bcrypt.compare(password, storedPassword)
};

