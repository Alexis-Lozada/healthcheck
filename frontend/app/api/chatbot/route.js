// app/api/chatbot/route.js
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { mensaje } = await request.json();
    
    if (!mensaje) {
      return NextResponse.json({
        success: false,
        error: 'No se proporcionó mensaje'
      }, { status: 400 });
    }

    // Obtener la sesión del usuario (opcional)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Buscar respuesta en la tabla ChatbotQA
    let respuesta;
    
    try {
      // Buscar respuesta basada en palabras clave
      const palabrasClaves = mensaje.split(/\s+/)
        .filter(word => word.length > 3)
        .map(word => word.toLowerCase());
      
      let preguntaMatch = null;
      
      // Si hay palabras clave, intentamos encontrar una coincidencia
      if (palabrasClaves.length > 0) {
        // Crear condiciones WHERE para buscar coincidencias parciales
        const whereConditions = palabrasClaves.map(word => ({
          OR: [
            { pregunta: { contains: word, mode: 'insensitive' } }
          ]
        }));
        
        // Buscar en la base de datos
        preguntaMatch = await prisma.chatbotQA.findFirst({
          where: {
            OR: whereConditions,
            activo: true
          },
          orderBy: {
            fecha_creacion: 'desc'
          }
        });
      }
      
      // Si no encontramos nada específico, buscar una respuesta genérica
      if (!preguntaMatch) {
        preguntaMatch = await prisma.chatbotQA.findFirst({
          where: {
            pregunta: { contains: 'general', mode: 'insensitive' },
            activo: true
          }
        });
      }
      
      // Si encontramos una respuesta, usarla
      if (preguntaMatch) {
        respuesta = {
          texto: preguntaMatch.respuesta,
          categoria: preguntaMatch.categoria || 'general',
          fuente: 'base_datos'
        };
      } else {
        // Respuesta predeterminada si no se encuentra nada
        respuesta = {
          texto: "No tengo información específica sobre eso. Te recomiendo consultar fuentes oficiales como la OMS o profesionales de la salud para información médica confiable.",
          categoria: 'general',
          fuente: 'predeterminada'
        };
      }
    } catch (dbError) {
      console.error('Error buscando respuesta en BD:', dbError);
      
      // Respuesta de respaldo en caso de error
      respuesta = {
        texto: "Lo siento, estoy teniendo problemas para procesar tu consulta en este momento. Por favor, intenta nuevamente más tarde.",
        categoria: 'error',
        fuente: 'error'
      };
    }
    
    // Registrar la consulta en logs (opcional)
    try {
      await prisma.logSistema.create({
        data: {
          nivel: 'info',
          mensaje: 'Consulta chatbot',
          origen: 'chatbot',
          detalles: JSON.stringify({
            mensaje: mensaje,
            respuesta: respuesta.texto,
            usuario_id: userId
          }),
          fecha: new Date()
        }
      });
    } catch (logError) {
      console.error('Error registrando log:', logError);
      // Continuamos incluso si falla el log
    }
    
    // Devolver la respuesta
    return NextResponse.json({
      success: true,
      data: {
        mensaje: respuesta.texto,
        categoria: respuesta.categoria,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error en chatbot:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error procesando mensaje',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

// Obtener frases comunes o preguntas frecuentes
export async function GET(request) {
  try {
    // Obtener preguntas frecuentes de la base de datos
    const preguntas = await prisma.chatbotQA.findMany({
      where: {
        activo: true
      },
      select: {
        id: true,
        pregunta: true,
        categoria: true
      },
      orderBy: {
        fecha_creacion: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      data: preguntas
    });
    
  } catch (error) {
    console.error('Error obteniendo preguntas frecuentes:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener preguntas frecuentes',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}