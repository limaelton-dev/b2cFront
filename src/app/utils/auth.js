import Cookies from 'js-cookie';

// Função auxiliar para obter o token JWT
export const getAuthHeader = () => {
    const token = Cookies.get('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Função auxiliar para verificar se o usuário está autenticado
export const isAuthenticated = () => {
    const token = Cookies.get('jwt');
    if (!token) return false;
    
    try {
        // Verificamos apenas se o token existe e tem um formato válido
        // A validação completa é feita pelo backend
        const tokenParts = token.split('.');
        return tokenParts.length === 3; // Um token JWT válido tem 3 partes
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return false;
    }
};

// Função para obter o token JWT
export const getToken = () => {
    return Cookies.get('jwt');
};

// Função para salvar o token JWT
export const saveToken = (token) => {
    Cookies.set('jwt', token, { expires: 7 }); // Token expira em 7 dias
};

// Função para remover o token JWT
export const removeToken = () => {
    Cookies.remove('jwt');
}; 