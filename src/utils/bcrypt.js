import bcrypt from 'bcrypt';

export const hash = async (value, saltrounds) => {
    return bcrypt.hash(value, saltrounds || 10);
}

export const compare = async (value, hashvalue) =>
    bcrypt.compare(value, hashvalue).catch(() => false)