import bcrypt from 'bcryptjs';

function hashPassword(password: string): string {
    // Implement your password hashing logic here
    return bcrypt.hashSync(password, 12); 
}

function verifyPassword(password: string, hashedPassword: string): boolean {
    // Implement your password verification logic here
    return bcrypt.compareSync(password, hashedPassword); 
}

const passwordHelper = {
    hashPassword,
    verifyPassword
};

export default passwordHelper;