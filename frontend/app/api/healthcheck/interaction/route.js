// app/api/healthcheck/interaction/route.js
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * Registra una interacción del usuario con una noticia
 */
export async function POST(request) {
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    
    // Verificar si el usuario está autenticado
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    
    // Obtener datos de la solicitud
    const { noticiaId, tipoInteraccion } = await request.json();
    
    if (!noticiaId || !tipoInteraccion) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }
    
    // Validar el tipo de interacción
    const tiposValidos = ['marcar_confiable', 'marcar_dudosa', 'compartir'];
    if (!tiposValidos.includes(tipoInteraccion)) {
      return NextResponse.json({ error: 'Tipo de interacción no válido' }, { status: 400 });
    }
    
    // Verificar si la noticia existe
    const noticia = await prisma.noticia.findUnique({
      where: { id: noticiaId }
    });
    
    if (!noticia) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }
    
    // Registrar la interacción
    const userId = parseInt(session.user.id);
    
    // Verificar si ya existe una interacción similar
    const existingInteraction = await prisma.interaccionNoticia.findFirst({
      where: {
        usuario_id: userId,
        noticia_id: noticiaId,
        tipo_interaccion: tipoInteraccion
      }
    });
    
    if (existingInteraction) {
      // Si ya existe, actualizamos la fecha
      await prisma.interaccionNoticia.update({
        where: {
          id: existingInteraction.id
        },
        data: {
          fecha_interaccion: new Date()
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Interacción actualizada' 
      });
    }
    
    // Si no existe, creamos una nueva
    const interaction = await prisma.interaccionNoticia.create({
      data: {
        usuario_id: userId,
        noticia_id: noticiaId,
        tipo_interaccion: tipoInteraccion,
        fecha_interaccion: new Date()
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Interacción registrada', 
      data: {
        id: interaction.id,
        tipo: tipoInteraccion,
        fecha: interaction.fecha_interaccion
      }
    });
    
  } catch (error) {
    console.error('Error registrando interacción:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}