import pool from "../../../../database/mysql";
import type { RowDataPacket } from "mysql2/promise";

/*
CREATE TABLE IF NOT EXISTS lms_lumiere_carnet.users (
	shadow_id CHAR(9),
    encrypted_pii BLOB,
    university VARCHAR(100) NOT NULL,
    faculty VARCHAR(80) NOT NULL,
    firstname BINARY(32) NOT NULL,
    uni_id BINARY(32) UNIQUE NOT NULL,
    date_of_birth BINARY(32) NOT NULL,
    PRIMARY KEY (shadow_id)
);
*/

interface UserRow extends RowDataPacket {
    shadow_id: string;
    encrypted_pii: Buffer;
    university: string;
    faculty: string;
    firstname: Buffer;
    uni_id: Buffer;
    date_of_birth: Buffer;
}

class UserRepository {

    static async create(userData: any) {
        const query = `
            INSERT INTO users (shadow_id, encrypted_pii, university, faculty, firstname, uni_id, date_of_birth) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [userData.shadow_id, userData.pii, 
            userData.university, userData.faculty, 
            userData.firstname, userData.uni_id, 
            userData.date_of_birth];

        const [rows, _field] = await pool.execute<UserRow[]>(query, values);
        return { id: rows[0].shadow_id, ...userData };
    }

    static async findAll() {
        const query = `SELECT * FROM users`;

        try {
            const [rows] = await pool.execute<UserRow[]>(query);
            return rows;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

}

export default UserRepository;