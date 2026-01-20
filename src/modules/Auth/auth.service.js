class AuthService {
  constructor(
    authRepository,
    userRepository,
    permissionRepository,
    roleRepository,
  ) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
  }

  async verifyUserExists(email) {
    // Verificar si el usuario ya existe
    const userExists = await this.userRepository.findUserByEmail(email);

    if (userExists) throw new Error("El email ya está registrado");

    return false;
  }

  async crearUsuario(userData) {
    return await this.userRepository(userData);
  }

  async register(newUserData) {
    const {
      firstName,
      lastName,
      secondLastName,
      email,
      password,
      role, // ObjectId del Role
      ies,
      phone,
    } = req.body;

    const newUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      secondLastName: req.body.secondLastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      ies: req.body.ies,
      phone: req.body.phone,
    };

    // Verificar si el usuario ya existe
    await this.authService.verifyUserExists(email);

    // Validación de permisos según rol del usuario autenticado
    if (req.user) {
      const creatorRoleName = req.user.role.name;

      // Admin Nacional
      if (creatorRoleName === "Admin Nacional") {
        if (req.user.role.requiresIES && !ies) {
          return res.status(400).json({
            success: false,
            message: "Debes especificar la IES para este tipo de usuario",
          });
        }
      }
      // Admin IES
      else if (creatorRoleName === "Admin IES") {
        // Solo puede crear usuarios dentro de su IES
        if (!ies || ies.toString() !== req.user.ies.toString()) {
          return res.status(403).json({
            success: false,
            message: "Solo puedes crear usuarios para tu IES",
          });
        }
      }
      // Otros roles
      else {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para crear usuarios",
        });
      }
    }

    // Crear usuario
    // const user = await User.create({
    //   firstName,
    //   lastName,
    //   secondLastName,
    //   email,
    //   password,
    //   role, // ObjectId del rol
    //   ies,
    //   phone,
    // });

    // Volver a cargar con rol y permisos
    const populatedUser = await User.findById(user._id)
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          match: { active: true },
        },
      })
      .populate("ies", "name code");

    const token = generateToken(user._id);

    // Configurar cookie con el token (httpOnly para seguridad)
    res.cookie("anuies_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.status(201).json({
      success: true,
      data: populatedUser.getPublicData(),
    });
  }
}

module.exports = AuthService;
