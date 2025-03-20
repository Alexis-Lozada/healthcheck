// app/api/register/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const userExists = await prisma.usuario.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.usuario.create({
      data: {
        email,
        nombre: nombre || email.split('@')[0],
        telefono,
        contrasena: hashedPassword,
        fecha_registro: new Date(),
        rol: "usuario", // Ahora es un String, no un enum
        activo: true
      },
    });

    console.log("Usuario registrado:", newUser.email);

    // Eliminar la contraseña de la respuesta
    const { contrasena, ...userWithoutPassword } = newUser;

    return NextResponse.json({ 
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}