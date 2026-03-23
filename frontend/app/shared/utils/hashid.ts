import Hashids from "hashids";

const HASHID_LENGTH = 10;
const hashids = new Hashids(process.env.HASHID_SALT || "default_salt", HASHID_LENGTH);

export const encodeId = (id: number): string => hashids.encode(id);

export const decodeId = (hash: string): number | null => {
    const res = hashids.decode(hash);
    if (!res.length) return null;
    return Number(res[0]);
};