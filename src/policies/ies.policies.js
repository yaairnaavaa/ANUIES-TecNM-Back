exports.scopeIESbyUser = (user) => {
  console.log("user from polici", user);
  if (!user) return {}; // Sin usuario, mostrar todas las IES

  // // Si es Admin IES u Operativo, solo puede ver su IES
  if (["Admin IES", "Operativo IES"].includes(user.role.name)) {
    return {
      _id: { $eq: user.ies },
    };
  }

  return {};
};

exports.haveAccessToIES = (user, id) => {
  if (!user) return true; // Sin autenticación, permitir acceso

  if (user.role?.name === "Admin Nacional") return true;

  if (!user.ies || !id) return false;

  return user.ies.equals(id);
};

exports.parseEditableFieldsForAdminIes = (user, data) => {
  if (!user) return { ...data }; // Sin usuario, permitir todos los campos

  if (user.role?.name === "Admin Nacional") return { ...data };

  // Admin IES y Operativo IES pueden editar estos campos
  const alowedData = { ...data };

  // Campos NO editables por Admin IES / Operativo IES
  delete alowedData.code;
  delete alowedData.active;
  delete alowedData.careers; // Las carreras se gestionan por endpoint específico

  return alowedData;
};
