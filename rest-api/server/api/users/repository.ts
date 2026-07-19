class UserRepository {

    static async create(userData: any) {
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const values = [userData.name, userData.email, userData.password];

        const result = await useQuery(query, values);
        return { id: result.insertId, ...userData };
    }

}

export default UserRepository;