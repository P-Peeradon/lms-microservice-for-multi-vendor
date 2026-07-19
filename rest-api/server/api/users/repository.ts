import pool from "../../../../database/mysql";
import type { RowDataPacket } from "mysql2/promise";

class UserRepository {

    static async create(userData: any) {
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const values = [userData.name, userData.email, userData.password];

        const result = await pool.execute<RowDataPacket[]>(query, values);
        return { id: result[0].insertId, ...userData };
    }

    static async findAll() {
        const query = `SELECT * FROM users`;

        try {
            const [rows] = await pool.execute<RowDataPacket[]>(query);
            return rows;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

}

export default UserRepository;