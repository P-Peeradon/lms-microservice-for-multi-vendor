import pool from "../../db/pool";

class UserRepository {

    static async create(userData: any) {
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const values = [userData.name, userData.email, userData.password];

        const result = await pool.execute(query, values);
        return { id: result[0].insertId, ...userData };
    }

}

export default UserRepository;