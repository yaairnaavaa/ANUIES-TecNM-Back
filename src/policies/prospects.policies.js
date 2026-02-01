// exports.scopeProspectsByUser = (user) => {
//   if (!user) throw new Error("User not provided");

//   if (user.role.name === "Admin Nacional") return {};

//   if (["Admin IES", "Operativo IES"].includes(user.role.name)) {
//     return {
//       "ies.iesId": { $eq: user.ies.id },
//     };
//   }
// };