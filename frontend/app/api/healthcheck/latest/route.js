// app/api/healthcheck/latest/route.js - Solución para ENUM
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const resultado = searchParams.get('result'); // falsa, verdadera, dudosa, o null (todas)
  
  try {
    let query;
    let params = [];
    
    // Seleccionar la consulta adecuada según el parámetro resultado
    if (resultado) {
      // Consulta filtrada por resultado - SIN usar LOWER() porque resultado es un ENUM
      query = `
        SELECT 
          n.id, n.titulo, n.contenido, n.url, n.fecha_publicacion, n.fecha_analisis,
          f.id as fuente_id, f.nombre as fuente_nombre,
          t.id as tema_id, t.nombre as tema_nombre,
          cn.resultado, cn.confianza
        FROM noticias n
        LEFT JOIN fuentes f ON n.fuente_id = f.id
        LEFT JOIN temas t ON n.tema_id = t.id
        JOIN clasificacion_noticias cn ON n.id = cn.noticia_id
        WHERE cn.resultado::text = $1
        ORDER BY n.fecha_analisis DESC
        LIMIT $2
      `;
      params = [resultado, limit];
    } else {
      // Consulta para todas las noticias
      query = `
        SELECT 
          n.id, n.titulo, n.contenido, n.url, n.fecha_publicacion, n.fecha_analisis,
          f.id as fuente_id, f.nombre as fuente_nombre,
          t.id as tema_id, t.nombre as tema_nombre,
          cn.resultado, cn.confianza
        FROM noticias n
        LEFT JOIN fuentes f ON n.fuente_id = f.id
        LEFT JOIN temas t ON n.tema_id = t.id
        LEFT JOIN clasificacion_noticias cn ON n.id = cn.noticia_id
        ORDER BY n.fecha_analisis DESC
        LIMIT $1
      `;
      params = [limit];
    }
    
    // Ejecutar la consulta
    console.log('Ejecutando consulta SQL...');
    const noticias = await prisma.$queryRawUnsafe(query, ...params);
    console.log(`Obtenidas ${noticias.length} noticias`);
    
    // Formatear los resultados para la respuesta
    const formattedNoticias = noticias.map(noticia => ({
      id: noticia.id,
      titulo: noticia.titulo,
      fecha_publicacion: noticia.fecha_publicacion,
      fecha_analisis: noticia.fecha_analisis,
      fuente: noticia.fuente_id ? {
        id: noticia.fuente_id,
        nombre: noticia.fuente_nombre
      } : null,
      tema: noticia.tema_id ? {
        id: noticia.tema_id,
        nombre: noticia.tema_nombre
      } : null,
      resultado: noticia.resultado,
      confianza: noticia.confianza
    }));
    
    // Retornar los resultados
    return NextResponse.json({
      success: true,
      data: formattedNoticias
    });
    
  } catch (error) {
    console.error('Error en consulta SQL:', error);
    
    // Intentamos una consulta de emergencia sin JOIN a clasificaciones
    try {
      const emergencyQuery = `
        SELECT 
          n.id, n.titulo, n.fecha_publicacion, n.fecha_analisis,
          f.id as fuente_id, f.nombre as fuente_nombre,
          t.id as tema_id, t.nombre as tema_nombre
        FROM noticias n
        LEFT JOIN fuentes f ON n.fuente_id = f.id
        LEFT JOIN temas t ON n.tema_id = t.id
        ORDER BY n.fecha_analisis DESC
        LIMIT $1
      `;
      
      const basicNoticias = await prisma.$queryRawUnsafe(emergencyQuery, limit);
      
      // Formatear resultados básicos
      const basicResults = basicNoticias.map(noticia => ({
        id: noticia.id,
        titulo: noticia.titulo,
        fecha_publicacion: noticia.fecha_publicacion,
        fecha_analisis: noticia.fecha_analisis,
        fuente: noticia.fuente_id ? {
          id: noticia.fuente_id,
          nombre: noticia.fuente_nombre
        } : null,
        tema: noticia.tema_id ? {
          id: noticia.tema_id,
          nombre: noticia.tema_nombre
        } : null,
        resultado: null,
        confianza: null
      }));
      
      return NextResponse.json({
        success: true,
        data: basicResults,
        note: "Datos limitados debido a un error en la consulta principal"
      });
      
    } catch (fallbackError) {
      console.error('Error en consulta de emergencia:', fallbackError);
      
      return NextResponse.json({
        success: false,
        error: 'Error al obtener noticias',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      }, { status: 500 });
    }
  }
}