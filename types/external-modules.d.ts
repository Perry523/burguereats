declare module "bcrypt" {
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

declare module "jsonwebtoken" {
  export interface SignOptions {
    expiresIn?: string | number;
    audience?: string | string[];
    issuer?: string;
    subject?: string;
  }

  export interface VerifyOptions {
    audience?: string | string[];
    issuer?: string;
    subject?: string;
    ignoreExpiration?: boolean;
  }

  export interface JwtPayload {
    [key: string]: unknown;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions
  ): string | JwtPayload;
}

declare module "prisma/config" {
  export interface PrismaConfig {
    schema?: string;
    migrations?: {
      path?: string;
    };
    engine?: string;
    datasource?: {
      url?: string;
    };
    seed?: {
      command: string;
    };
  }

  export function defineConfig(config: PrismaConfig): PrismaConfig;
  export function env(key: string): string;
}
