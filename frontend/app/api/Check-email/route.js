// app/api/check-email/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true } // Solo recuperamos el ID para verificar existencia
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error al verificar email:", error);
    return NextResponse.json({ error: "Error al verificar email" }, { status: 500 });
  }
}