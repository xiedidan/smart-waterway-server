const errors = {
    // user error codes
    INTERNAL_ERROR: { code: 10000, message: '程序内部错误' },
    TOO_MANY_REQUESTS: { code: 10001, message: '请求过多' },
    UNAUTHORIZED: { code: 10002, message: '请登录' },
    MISSING_REQUEST_FIELDS: { code: 10003, message: '请求所需要的内容缺失', fields: [] },

    USERNAME_UNAVAILABLE: { code: 20001, message: '用户名已被占用' },

    LOGIN_FAILED: { code: 20004, message: '登录失败, 用户名或密码错误' },
    LOGIN_INTERNAL_ERROR: { code: 20005, message: '登录失败, 请稍后再试' },
    WRONG_PASSWORD: { code: 20006, message: '密码错误' }, // 已登录用户，修改密码需要输入原密码
    
    VALIDATION_ERROR: {
        code: 20100, message: '验证错误', model: '', paths: []
    },
    CONSTRAINT_ERROR: {
        code: 20100, message: '约束错误', model: '', paths: []
    },

    USER_NOT_FOUND: { code: 30100, message: '找不到用户' },
    USERNAME_EXISTED: { code: 30200, message: '用户名重复' },

    PROJECT_NOT_FOUND: { code: 40100, message: '找不到项目' },
    PROJECT_NAME_EXISTED: { code: 40200, message: '项目名重复' },

    ENTITY_NOT_FOUND: { code: 50100, message: '找不到实体' },
    ENTITY_NAME_EXISTED: { code: 50200, message: '实体名重复' },
};

export default errors;
