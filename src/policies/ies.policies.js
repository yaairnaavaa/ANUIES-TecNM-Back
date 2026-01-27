exports.scopeIESbyUser = (user) => {
  console.log("user from polici", user);
  if (!user) throw new Error("Not user provided");

  // // Si es Admin IES u Operativo, solo puede ver su IES
  if (["Admin IES", "Operativo IES"].includes(user.role.name)) {
    return {
      _id: { $eq: user.ies },
    };
  }

  return {};
};

exports.haveAccessToIES = (user, id) => {
  if (!user) throw new Error("Not user provided");

  if (user.role?.name === "Admin Nacional") return true;

  if (!user.ies || !id) return false;

  return user.ies.equals(id);
};

exports.parseEditableFieldsForAdminIes = (user, data) => {
  if (!user) throw new Error("Not user provided");

  if (user.role?.name === "Admin Nacional") return { ...data };

  const alowedData = { ...data };

  delete alowedData.code;
  delete alowedData.active;

  return alowedData;
};
