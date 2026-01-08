const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const IES = require('./models/IES');
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
