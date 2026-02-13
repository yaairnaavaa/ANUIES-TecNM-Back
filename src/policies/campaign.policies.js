exports.scopeCampaignByUser = (user) => {
  if (!user) throw new Error("User not provided");

  if (user.role.name === "Admin Nacional") return {};

  if (["Admin IES", "Operativo IES"].includes(user.role.name)) {
    // Validar que el usuario tenga IES asignado
    if (!user.ies) {
      throw new Error(`Usuario con rol ${user.role.name} debe tener una IES asignada`);
    }
    return {
      "ies.iesId": { $eq: user.ies._id },
    };
  }

  return {};
};
