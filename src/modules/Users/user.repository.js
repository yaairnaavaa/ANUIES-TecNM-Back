const User = require("./User.model.js");

class UserRepository {
  async getUsers(queryObject) {
    return await User.getPublicData();
  }

  async createUser(data) {
    return await User.insertOne(data);
  }

  async getUserById(idUser) {
    return await User.finById(idUser);
  }

  async updateUser(idUser, data) {
    return await User.findByIdAndUpdate(idUser, data, { new: true });
  }
}

module.exposts = UserRepository;
