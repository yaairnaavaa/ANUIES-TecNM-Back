const User = require("../../../models/User.js");

class UserRepository {
  async getUsers(queryObject = {}) {
    const query = {};
    
    // Filtrar por IES si se proporciona
    if (queryObject.ies) {
      query.ies = queryObject.ies;
    }
    
    // Filtrar por email si se proporciona
    if (queryObject.email) {
      query.email = queryObject.email;
    }
    
    // Filtrar por estado activo
    if (queryObject.active !== undefined) {
      query.active = queryObject.active;
    }
    
    return await User.find(query).populate('role').populate('ies').select('-password');
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async getUserById(idUser) {
    return await User.findById(idUser).populate('role').populate('ies').select('-password');
  }

  async updateUser(idUser, data) {
    return await User.findByIdAndUpdate(idUser, data, { new: true, runValidators: true }).populate('role').populate('ies').select('-password');
  }

  async deleteUser(idUser) {
    return await User.findByIdAndUpdate(idUser, { active: false }, { new: true });
  }
}

module.exports = UserRepository;
