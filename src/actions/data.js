import { sql } from '@vercel/postgres';
import md5 from "md5";


export async function getUser(nick, password) {
    const data = await sql`SELECT * 
    FROM admin
    WHERE nick ILIKE ${`%${nick}%`} and password ILIKE ${md5(password)}`;

    if (data.rows.length) {
        return data.rows[0];
    }

}