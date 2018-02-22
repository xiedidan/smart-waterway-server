export const USER_ROLES = {
    NORMAL: 0,
    ADMIN: 1
}

export const DEFAULT_USER = {
    username: 'admin',
    password: 'swAdmin12',
    role: USER_ROLES.ADMIN
}

export const DOCUMENT_ACCESS = {
    PUBLIC: 0,
    PRIVATE: 1
}

export const ENTITY_TYPES = {
    UNKNOWN: 0,
    DOCUMENT: 1
}

export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
