import Hashids from "hashids";

const HASHID_LENGTH = 10;

export const encodeId = (id: number): string => {
    const salt = process.env.HASHID_SALT;
    if (!salt) throw new Error("HASHID_SALT is not set");
    const hashids = new Hashids(salt, HASHID_LENGTH);
    console.log(`SALT - encode: ${salt}`);
    return hashids.encode(id);
}

export const decodeId = (hash: string): number | null => {
    const salt = process.env.HASHID_SALT;
    if (!salt) throw new Error("HASHID_SALT is not set");
    const hashids = new Hashids(salt, HASHID_LENGTH);
    console.log(`SALT - decode: ${salt}`);
    const res = hashids.decode(hash);
    return res.length ? Number(res[0]) : null;
}