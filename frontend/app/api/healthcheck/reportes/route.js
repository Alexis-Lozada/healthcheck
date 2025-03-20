// app/api/reportes/route.js
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo'); // 'fuentes' para obtener fuentes verificadas
  
  try {
    // Obtener la sesión del usuario (opcional)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Obtener fuentes verificadas
    if (tipo === 'fuentes') {
      const fuentes = await prisma.fuente.findMany({
        where: {
          verificada: true
        },
        select: {
          id: true,
          nombre: true,
          url: true,
          descripcion: true,
          confiabilidad: true,
          noticias: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          confiabilidad: 'desc'
        },
        take: 20
      });
      
      // Formatear resultado para incluir conteo de noticias
      const resultado = fuentes.map(fuente => ({
        id: fuente.id,
        nombre: fuente.nombre,
        url: fuente.url,
        descripcion: fuente.descripcion,
        confiabilidad: fuente.confiabilidad,
        total_noticias: fuente.noticias?.length || 0
      }));
      
      return NextResponse.json({
        success: true,
        data: resultado
      });
    }
    
    // Obtener reportes de fuentes
    else if (tipo === 'reportes') {
      const reportes = await prisma.reporteFuente.findMany({
        where: {
          // Filtro por usuario si está autenticado y lo solicita
          ...(userId && searchParams.get('misReportes') === 'true' ? {
            // Aquí no hay campo usuario_id en ReporteFuente, 
            // así que no podemos filtrar por usuario
          } : {})
        },
        include: {
          fuente: {
            select: {
              id: true,
              nombre: true
            }
          }
        },
        orderBy: {
          periodo_fin: 'desc'
        },
        take: 20
      });
      
      return NextResponse.json({
        success: true,
        data: reportes
      });
    }
    
    // Si no hay tipo específico, devolver error
    else {
      return NextResponse.json({
        success: false,
        error: 'Tipo de consulta no especificado'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener datos',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, tipo, comentario } = body;
    
    // Validar datos
    if (!url || !tipo) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos (url, tipo)'
      }, { status: 400 });
    }
    
    // Obtener la sesión del usuario (opcional)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Buscar si ya existe la fuente
    let fuente = await prisma.fuente.findFirst({
      where: {
        url: {
          contains: url,
          mode: 'insensitive'
        }
      }
    });
    
    // Si no existe la fuente, la creamos
    if (!fuente) {
      // Extraer nombre del dominio
      let nombre = url;
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        nombre = urlObj.hostname.replace('www.', '');
      } catch (e) {
        console.error('Error parseando URL:', e);
      }
      
      fuente = await prisma.fuente.create({
        data: {
          nombre: nombre,
          url: url,
          confiabilidad: 0,
          verificada: false,
          descripcion: `Fuente reportada por usuario${userId ? ` ID ${userId}` : ''}`
        }
      });
    }
    
    // Crear un reporte de la fuente para que sea revisado
    await prisma.reporteFuente.create({
      data: {
        fuente_id: fuente.id,
        periodo_inicio: new Date(),
        periodo_fin: new Date(),
        total_noticias: 1,
        porcentaje_veracidad: null,
        observaciones: comentario || `Reporte de usuario: ${tipo}`
      }
    });
    
    // Registrar en logs
    await prisma.logSistema.create({
      data: {
        nivel: 'info',
        mensaje: 'Reporte de fuente',
        origen: 'reportes',
        detalles: JSON.stringify({
          url,
          tipo,
          comentario,
          fuente_id: fuente.id,
          usuario_id: userId
        }),
        fecha: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Reporte enviado correctamente',
      data: {
        fuente_id: fuente.id
      }
    });
    
  } catch (error) {
    console.error('Error creando reporte:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al crear el reporte',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}