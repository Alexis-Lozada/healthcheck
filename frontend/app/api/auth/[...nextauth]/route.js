// app/api/auth/[...nextauth]/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        console.log("[DEBUG] authorize - Autorizando credenciales:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor ingrese su correo y contraseña");
        }

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          console.log("[DEBUG] authorize - Usuario no encontrado:", credentials.email);
          throw new Error("Usuario no encontrado. Por favor registrese primero.");
        }

        if (!user.contrasena) {
          console.log("[DEBUG] authorize - Usuario sin contraseña (Google auth):", user.email);
          throw new Error("Este usuario se registró usando Google. Por favor use ese método para iniciar sesión.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.contrasena
        );

        if (!passwordMatch) {
          console.log("[DEBUG] authorize - Contraseña incorrecta:", user.email);
          throw new Error("Contraseña incorrecta. Por favor intente nuevamente.");
        }

        console.log("[DEBUG] authorize - Autorización exitosa:", user.email);
        return {
          id: user.id.toString(),
          name: user.nombre,
          email: user.email,
          role: user.rol
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[DEBUG] signIn callback - Perfil:", profile?.email);
      
      if (account?.provider === "google" && profile?.email) {
        try {
          // Verificar si el usuario ya existe
          const existingUser = await prisma.usuario.findUnique({
            where: { email: profile.email }
          });
          
          if (existingUser) {
            // Usuario ya existe, actualizar la info del usuario
            user.id = existingUser.id;
            user.email = existingUser.email;
            user.name = existingUser.nombre;
            user.role = existingUser.rol;
            return true;
          }
          
          // Si no existe, crear nuevo usuario
          // Ahora el campo rol es un String, así que no habrá problemas
          const newUser = await prisma.usuario.create({
            data: {
              email: profile.email,
              nombre: profile.name || profile.email.split('@')[0],
              rol: "usuario", // Ahora es un String, no un enum
              fecha_registro: new Date(),
              activo: true
            }
          });
          
          // Si la creación del usuario fue exitosa, crear la cuenta manualmente
          await prisma.cuenta.create({
            data: {
              usuarioId: newUser.id,
              tipo: account.type,
              proveedor: account.provider,
              proveedorCuentaId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state
            }
          });
          
          user.id = newUser.id;
          console.log("[DEBUG] signIn - Usuario creado:", newUser.email);
          return true;
        } catch (error) {
          console.error("[ERROR] signIn - Error:", error);
          // Ver detalles del error
          if (error.code) {
            console.error("Error code:", error.code);
          }
          if (error.meta) {
            console.error("Error meta:", error.meta);
          }
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "usuario";
      }
      
      // Si tenemos un account, puede ser un nuevo login con OAuth
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.provider = token.provider;
      }
      
      if (session.user?.email) {
        try {
          // Actualizar última conexión
          const user = await prisma.usuario.findUnique({
            where: { email: session.user.email }
          });
          
          if (user) {
            await prisma.usuario.update({
              where: { id: user.id },
              data: { ultima_conexion: new Date() }
            });
          }
        } catch (error) {
          console.error("[ERROR] session - Error al actualizar conexión:", error);
        }
      }
      
      return session;
    }
  },
  events: {
    async createUser(message) {
      console.log("[EVENT] createUser:", message);
    },
    async linkAccount(message) {
      console.log("[EVENT] linkAccount:", message);
    },
    async session(message) {
      console.log("[EVENT] session:", message);
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  allowDangerousEmailAccountLinking: true
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;