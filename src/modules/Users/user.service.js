class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(queryObject) {
    return await this.userRepository.getUsers(queryObject);
  }

  async createUser(data) {
    return await this.userRepository.createUser(data);
  }

  async getUserById(idUser) {
    const user = await this.userRepository.getUserById(idUser);

    if (!user) throw new Error(`User con id: ${id} no existe`);

    return user;
  }

  async updateUser(idUser, data) {
    const updatedUser = await this.userRepository.updateUser(idUser, data);

    if (updatedUser) return user;

    await this.getUserById(idUser);

    throw new Error(
      `No fue posible actualizar el usuario. Intentalo más tarde`,
    );
  }
}

module.exports = UserService;
