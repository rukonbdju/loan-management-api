
export const parseError = (error: any, statusCode?: number, message?: string) => {
    // Duplicate Key Error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[field];
        return {
            status: 400,
            success: false,
            error: "Duplicate field",
            field,
            value,
            message: `${field} '${value}' already exists`
        };
    }

    // Validation Error
    if (error.name === "ValidationError") {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });
        return {
            status: 400,
            success: false,
            error: "Validation error",
            fields: errors
        };
    }

    // Default fallback
    return {
        status: statusCode || 500,
        success: false,
        error: error,
        message: message || error.message || "Something went wrong"
    };
};
