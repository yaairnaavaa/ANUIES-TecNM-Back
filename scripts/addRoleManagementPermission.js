/**
 * Script para agregar el permiso de "Gestión de Roles" al sistema
 * y asociarlo al rol de "Admin Nacional"
 * 
 * Ejecución: node scripts/addRoleManagementPermission.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MenuPermission = require('../models/MenuPermission');
const Role = require('../models/Role');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

const addRoleManagementPermission = async () => {
  try {
    console.log('🚀 Iniciando proceso...\n');

    // 1. Crear el nuevo permiso de "Gestión de Roles"
    console.log('📝 Creando permiso de Gestión de Roles...');
    
    // Verificar si ya existe
    let rolePermission = await MenuPermission.findOne({ routerLink: '/admin/roles' });
    
    if (rolePermission) {
      console.log('⚠️  El permiso ya existe en la base de datos');
      console.log('   ID:', rolePermission._id);
    } else {
      rolePermission = await MenuPermission.create({
        label: 'Roles y Permisos',
        icon: 'fas fa-user-shield',
        routerLink: '/admin/roles',
        category: 'Administración',
        active: true,
        order: 100
      });
      console.log('✅ Permiso creado exitosamente');
      console.log('   ID:', rolePermission._id);
      console.log('   Etiqueta:', rolePermission.label);
      console.log('   Ruta:', rolePermission.routerLink);
    }

    // 2. Buscar el rol de Admin Nacional
    console.log('\n🔍 Buscando rol Admin Nacional...');
    const adminNacional = await Role.findOne({ name: 'Admin Nacional' });
    
    if (!adminNacional) {
      console.log('❌ No se encontró el rol "Admin Nacional"');
      console.log('   Roles disponibles:');
      const roles = await Role.find({}, 'name displayName');
      roles.forEach(role => {
        console.log(`   - ${role.name} (${role.displayName})`);
      });
      return;
    }

    console.log('✅ Rol encontrado:', adminNacional.displayName);
    console.log('   ID:', adminNacional._id);
    console.log('   Permisos actuales:', adminNacional.permissions.length);

    // 3. Verificar si el permiso ya está asignado
    const permissionExists = adminNacional.permissions.some(
      p => p.toString() === rolePermission._id.toString()
    );

    if (permissionExists) {
      console.log('\n⚠️  El permiso ya está asignado al Admin Nacional');
    } else {
      // 4. Agregar el permiso al rol
      adminNacional.permissions.push(rolePermission._id);
      await adminNacional.save();
      console.log('\n✅ Permiso agregado exitosamente al Admin Nacional');
      console.log('   Total de permisos:', adminNacional.permissions.length);
    }

    // 5. Mostrar todos los permisos del Admin Nacional
    console.log('\n📋 Permisos del Admin Nacional:');
    const adminWithPermissions = await Role.findById(adminNacional._id)
      .populate('permissions', 'label routerLink category');
    
    adminWithPermissions.permissions.forEach((perm, index) => {
      console.log(`   ${index + 1}. ${perm.label} (${perm.routerLink})`);
    });

    console.log('\n✨ Proceso completado exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error durante el proceso:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar
const run = async () => {
  await connectDB();
  await addRoleManagementPermission();
};

run();
