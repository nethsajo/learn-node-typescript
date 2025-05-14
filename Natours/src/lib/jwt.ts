import jwt, { type SignOptions } from 'jsonwebtoken';

export type BaseJWTPayload = {
  sub: number;
  iss?: 'login' | 'refresh';
  aud?: 'frontend' | 'backend';
};

export type JWTPayload<T extends Record<string, unknown>> = BaseJWTPayload & T;

export type GenerateJWTArgs<TPayload extends Record<string, unknown>> = {
  payload: JWTPayload<TPayload>;
  secretOrPrivateKey: string;
  signOptions?: SignOptions;
};

export function generateJWT<TPayload extends Record<string, unknown>>({
  payload,
  secretOrPrivateKey,
  signOptions,
}: GenerateJWTArgs<TPayload>) {
  return jwt.sign(payload, secretOrPrivateKey, signOptions);
}
