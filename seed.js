const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const IES = require('./models/IES');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const Period = require('./models/Period');
const connectDB = require('./config/database');

// Conectar a la base de datos
connectDB();

// Datos de ejemplo
const seedData = async () => {
  try {
    console.log('Limpiando base de datos...');
    
    // Limpiar colecciones (solo para desarrollo)
    await User.deleteMany({});
    await IES.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Period.deleteMany({});

    console.log('Creando permisos del sistema...');
    
    // Crear permisos básicos
    const permissions = await Permission.insertMany([
      // Usuarios
      { name: 'users.create', displayName: 'Crear Usuarios', module: 'Usuarios', action: 'create', resource: 'users' },
      { name: 'users.read', displayName: 'Ver Usuarios', module: 'Usuarios', action: 'read', resource: 'users' },
      { name: 'users.update', displayName: 'Actualizar Usuarios', module: 'Usuarios', action: 'update', resource: 'users' },
      { name: 'users.delete', displayName: 'Eliminar Usuarios', module: 'Usuarios', action: 'delete', resource: 'users' },
      // IES
      { name: 'ies.create', displayName: 'Crear IES', module: 'IES', action: 'create', resource: 'ies' },
      { name: 'ies.read', displayName: 'Ver IES', module: 'IES', action: 'read', resource: 'ies' },
      { name: 'ies.update', displayName: 'Actualizar IES', module: 'IES', action: 'update', resource: 'ies' },
      { name: 'ies.delete', displayName: 'Eliminar IES', module: 'IES', action: 'delete', resource: 'ies' },
      // IEMS
      { name: 'iems.create', displayName: 'Crear IEMS', module: 'IEMS', action: 'create', resource: 'iems' },
      { name: 'iems.read', displayName: 'Ver IEMS', module: 'IEMS', action: 'read', resource: 'iems' },
      { name: 'iems.update', displayName: 'Actualizar IEMS', module: 'IEMS', action: 'update', resource: 'iems' },
      { name: 'iems.delete', displayName: 'Eliminar IEMS', module: 'IEMS', action: 'delete', resource: 'iems' },
      // Campañas
      { name: 'campaigns.create', displayName: 'Crear Campañas', module: 'Campañas', action: 'create', resource: 'campaigns' },
      { name: 'campaigns.read', displayName: 'Ver Campañas', module: 'Campañas', action: 'read', resource: 'campaigns' },
      { name: 'campaigns.update', displayName: 'Actualizar Campañas', module: 'Campañas', action: 'update', resource: 'campaigns' },
      { name: 'campaigns.delete', displayName: 'Eliminar Campañas', module: 'Campañas', action: 'delete', resource: 'campaigns' },
      // Prospectos
      { name: 'prospects.create', displayName: 'Crear Prospectos', module: 'Prospectos', action: 'create', resource: 'prospects' },
      { name: 'prospects.read', displayName: 'Ver Prospectos', module: 'Prospectos', action: 'read', resource: 'prospects' },
      { name: 'prospects.update', displayName: 'Actualizar Prospectos', module: 'Prospectos', action: 'update', resource: 'prospects' },
      { name: 'prospects.delete', displayName: 'Eliminar Prospectos', module: 'Prospectos', action: 'delete', resource: 'prospects' },
      // Periodos
      { name: 'periods.create', displayName: 'Crear Periodos', module: 'Periodos', action: 'create', resource: 'periods' },
      { name: 'periods.read', displayName: 'Ver Periodos', module: 'Periodos', action: 'read', resource: 'periods' },
      { name: 'periods.update', displayName: 'Actualizar Periodos', module: 'Periodos', action: 'update', resource: 'periods' },
      { name: 'periods.delete', displayName: 'Eliminar Periodos', module: 'Periodos', action: 'delete', resource: 'periods' },
      // Reportes
      { name: 'reports.export', displayName: 'Exportar Reportes', module: 'Reportes', action: 'export', resource: 'reports' },
      { name: 'reports.read', displayName: 'Ver Reportes', module: 'Reportes', action: 'read', resource: 'reports' }
    ]);

    console.log(`${permissions.length} permisos creados`);

    console.log('Creando roles del sistema...');

    // Obtener IDs de permisos para asignar
    const allPermissionIds = permissions.map(p => p._id);
    const iesPermissionIds = permissions.filter(p => 
      ['ies', 'iems', 'campaigns', 'prospects', 'reports'].includes(p.resource)
    ).map(p => p._id);
    const operativoPermissionIds = permissions.filter(p => 
      ['campaigns', 'prospects'].includes(p.resource) && ['create', 'read', 'update'].includes(p.action)
    ).map(p => p._id);

    // Crear roles
    await Role.insertMany([
      {
        name: 'Admin Nacional',
        displayName: 'Administrador Nacional',
        description: 'Acceso total al sistema',
        permissions: allPermissionIds,
        level: 10,
        scope: 'Nacional',
        requiresIES: false
      },
      {
        name: 'Admin IES',
        displayName: 'Administrador de IES',
        description: 'Administración completa de una IES',
        permissions: iesPermissionIds,
        level: 5,
        scope: 'IES',
        requiresIES: true
      },
      {
        name: 'Operativo IES',
        displayName: 'Operativo de IES',
        description: 'Gestión de campañas y prospectos',
        permissions: operativoPermissionIds,
        level: 3,
        scope: 'IES',
        requiresIES: true
      },
      {
        name: 'Interesado',
        displayName: 'Interesado/Prospecto',
        description: 'Usuario interesado en ingresar al TecNM',
        permissions: [],
        level: 1,
        scope: 'General',
        requiresIES: false
      }
    ]);

    console.log('Roles creados exitosamente');

    console.log('Creando periodo académico actual...');

    // Crear periodo actual
    await Period.create({
      name: 'Periodo Enero-Junio',
      code: 'ENE-JUN-2026',
      academicYear: '2026',
      semester: 'Enero-Junio',
      dates: {
        enrollmentStart: new Date('2026-01-15'),
        enrollmentEnd: new Date('2026-02-15'),
        classStart: new Date('2026-02-17'),
        classEnd: new Date('2026-06-30'),
        examPeriodStart: new Date('2026-06-20'),
        examPeriodEnd: new Date('2026-06-27')
      },
      recruitmentPhases: {
        prospecting: {
          start: new Date('2025-11-01'),
          end: new Date('2026-01-31')
        },
        campaignsActive: {
          start: new Date('2025-11-15'),
          end: new Date('2026-02-10')
        },
        applicationProcess: {
          start: new Date('2026-01-15'),
          end: new Date('2026-02-15')
        },
        entranceExam: {
          date: new Date('2026-02-08')
        },
        resultsPublication: {
          date: new Date('2026-02-12')
        },
        enrollment: {
          start: new Date('2026-02-13'),
          end: new Date('2026-02-15')
        }
      },
      targets: {
        totalEnrollmentGoal: 5000,
        newStudentsGoal: 2000,
        prospectsGoal: 3500
      },
      status: 'Activo',
      isCurrent: true
    });

    console.log('Periodo académico creado');

    console.log('Creando usuario administrador nacional...');
    
    // Crear Admin Nacional
    const adminNacional = await User.create({
      firstName: 'Administrador',
      lastName: 'Nacional',
      secondLastName: 'TecNM',
      email: 'admin@tecnm.mx',
      password: 'Admin123!',
      role: 'Admin Nacional',
      phone: '5555555555',
      active: true
    });

    console.log('Usuario Admin Nacional creado:', adminNacional.email);

    console.log('Creando IES de ejemplo...');

    // Crear una IES de ejemplo
    const iesExample = await IES.create({
      code: 'ITMORELIA',
      name: 'Instituto Tecnológico de Morelia',
      shortName: 'IT Morelia',
      address: {
        street: 'Av. Tecnológico',
        number: '1500',
        neighborhood: 'Lomas de Santiaguito',
        municipality: 'Morelia',
        state: 'Michoacán',
        postalCode: '58120',
        country: 'México'
      },
      contact: {
        generalPhone: '4431612345',
        email: 'contacto@itmorelia.edu.mx',
        website: 'https://www.itmorelia.edu.mx',
        socialMedia: {
          facebook: 'https://facebook.com/itmorelia',
          instagram: '@itmorelia',
          twitter: '@itmorelia'
        }
      },
      careers: [
        {
          name: 'Ingeniería en Sistemas Computacionales',
          code: 'ISC',
          modality: 'Presencial',
          duration: 9,
          shift: ['Matutino', 'Vespertino'],
          capacityPerSemester: 80,
          active: true
        },
        {
          name: 'Ingeniería Industrial',
          code: 'IND',
          modality: 'Presencial',
          duration: 9,
          shift: ['Matutino'],
          capacityPerSemester: 60,
          active: true
        },
        {
          name: 'Ingeniería Electrónica',
          code: 'IEL',
          modality: 'Presencial',
          duration: 9,
          shift: ['Matutino', 'Vespertino'],
          capacityPerSemester: 50,
          active: true
        }
      ],
      configuration: {
        requiresEntranceExam: true,
        acceptsDirectPass: true
      },
      active: true
    });

    console.log('IES creada:', iesExample.name);

    console.log('Creando usuario administrador de IES...');

    // Crear Admin IES
    const adminIES = await User.create({
      firstName: 'Director',
      lastName: 'García',
      secondLastName: 'Pérez',
      email: 'director@itmorelia.edu.mx',
      password: 'Director123!',
      role: 'Admin IES',
      ies: iesExample._id,
      phone: '4431234567',
      active: true
    });

    console.log('Usuario Admin IES creado:', adminIES.email);

    console.log('Creando usuario operativo...');

    // Crear Operativo IES
    const operativoIES = await User.create({
      firstName: 'Juan',
      lastName: 'Martínez',
      secondLastName: 'López',
      email: 'operativo@itmorelia.edu.mx',
      password: 'Operativo123!',
      role: 'Operativo IES',
      ies: iesExample._id,
      phone: '4437654321',
      active: true
    });

    console.log('Usuario Operativo IES creado:', operativoIES.email);

    console.log('\nRESUMEN DE DATOS DE PRUEBA:');
    console.log('================================');
    console.log('\nPERMISOS Y ROLES:');
    console.log(`   - ${permissions.length} permisos creados`);
    console.log('   - 4 roles del sistema creados');
    console.log('\nPERIODO ACADÉMICO:');
    console.log('   - Periodo ENE-JUN-2026 (Activo)');
    console.log('   - Inscripciones: 15 Ene - 15 Feb 2026');
    console.log('\nCREDENCIALES DE ACCESO:');
    console.log('\n1. Admin Nacional:');
    console.log('   Email: admin@tecnm.mx');
    console.log('   Password: Admin123!');
    console.log('\n2. Admin IES (IT Morelia):');
    console.log('   Email: director@itmorelia.edu.mx');
    console.log('   Password: Director123!');
    console.log('\n3. Operativo IES (IT Morelia):');
    console.log('   Email: operativo@itmorelia.edu.mx');
    console.log('   Password: Operativo123!');
    console.log('\n================================');
    console.log('Seed completado exitosamente!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error en el seed:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seedData();
