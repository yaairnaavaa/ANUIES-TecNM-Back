class RoleService {
  constructor(roleRepository, userRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

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

    //crear usuario
    
}
