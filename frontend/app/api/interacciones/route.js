// app/api/interacciones/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuarioId, noticiaId, tipoInteraccion } = body;
    
    if (!noticiaId || !tipoInteraccion) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos'
      }, { status: 400 });
    }

    // Validar tipo de interacción
    const tiposValidos = ['marcar_confiable', 'marcar_dudosa', 'compartir', 'like', 'dislike', 'report'];
    if (!tiposValidos.includes(tipoInteraccion)) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de interacción no válido'
      }, { status: 400 });
    }
    
    // Registrar interacción
    await prisma.$queryRawUnsafe(`
      INSERT INTO interacciones_noticia (
        usuario_id,
        noticia_id,
        tipo_interaccion,
        fecha_interaccion
      ) VALUES (
        $1, $2, $3, NOW()
      )
    `, usuarioId || null, parseInt(noticiaId), tipoInteraccion);
    
    return NextResponse.json({
      success: true,
      message: 'Interacción registrada correctamente'
    });
    
  } catch (error) {
    console.error('Error registrando interacción:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al registrar la interacción',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

// Obtener estadísticas de interacciones
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const noticiaId = searchParams.get('noticiaId');
  
  if (!noticiaId) {
    return NextResponse.json({
      success: false,
      error: 'ID de noticia requerido'
    }, { status: 400 });
  }
  
  try {
    const estadisticas = await prisma.$queryRawUnsafe(`
      SELECT 
        tipo_interaccion,
        COUNT(*) as cantidad
      FROM interacciones_noticia
      WHERE noticia_id = $1
      GROUP BY tipo_interaccion
    `, parseInt(noticiaId));
    
    return NextResponse.json({
      success: true,
      data: estadisticas
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}