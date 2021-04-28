export class AuthService {
    
    async signIn(username, password) {
        return {
            jwt: 'qwertzuikjhgfcvbjiugbn',
            error: '',
        };
    }

    async signUp(username, email, password) {
        return {
            jwt: 'qwertzuikjhgfcvbjiugbn',
            error: '',
        };
    }
}

export const authService = new AuthService();