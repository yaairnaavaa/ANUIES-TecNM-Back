const NotificacionesService = require("../Notificaciones/notificaciones.service");
const notificationService = new NotificacionesService();

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(queryObject) {
    return await this.userRepository.getUsers(queryObject);
  }

  async createUser(data) {
    // Validar que el email no exista
    const existingUser = await this.userRepository.getUsers({ email: data.email });
    if (existingUser && existingUser.length > 0) {
      throw new Error('El email ya está registrado');
    }

    const createdUser = await this.userRepository.createUser(data);

    // Enviar correo con credenciales
    try {
      const frontUrl = process.env.ANUIES_FRONT_URL || "http://localhost:4200";
      const loginLink = `${frontUrl}/login`;
      const userName = `${data.firstName} ${data.lastName}`.trim();

      // Enviamos el correo de forma asíncrona pero sin esperar la promesa (fire and forget)
      // para no bloquear la respuesta
      notificationService.sendNewUserEmail(data.email, data.password, loginLink, userName)
        .then(result => {
          if (result.success) console.log(`📧 Correo de bienvenida enviado a ${data.email}`);
        })
        .catch(err => console.error("Error enviando correo de bienvenida", err));
    } catch (error) {
      console.error("Error al intentar enviar correo de nuevo usuario", error);
    }

    return createdUser;
  }

  async getUserById(idUser) {
    const user = await this.userRepository.getUserById(idUser);

    if (!user) throw new Error(`Usuario con id: ${idUser} no existe`);

    return user;
  }

  async updateUser(idUser, data) {
    // Verificar que el usuario existe
    await this.getUserById(idUser);

    // Si se está actualizando el email, verificar que no exista
    if (data.email) {
      const existingUser = await this.userRepository.getUsers({ email: data.email });
      if (existingUser && existingUser.length > 0 && existingUser[0]._id.toString() !== idUser) {
        throw new Error('El email ya está registrado');
      }
    }

    const updatedUser = await this.userRepository.updateUser(idUser, data);

    if (!updatedUser) {
      throw new Error('No fue posible actualizar el usuario. Inténtalo más tarde');
    }

    return updatedUser;
  }

  async deleteUser(idUser) {
    // Verificar que el usuario existe
    await this.getUserById(idUser);

    return await this.userRepository.deleteUser(idUser);
  }
}

module.exports = UserService;
