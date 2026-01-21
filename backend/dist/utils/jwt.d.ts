export interface JwtPayload {
    userId: string;
    email: string;
}
export declare const generateTokens: (payload: JwtPayload) => {
    accessToken: never;
    refreshToken: never;
};
export declare const verifyToken: (token: string, secret: string) => JwtPayload;
