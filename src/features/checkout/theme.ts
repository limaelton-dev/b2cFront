export const THEME_COLOR = '#252d5f';
export const THEME_COLOR_LIGHT = 'rgba(37, 45, 95, 0.08)';
export const THEME_COLOR_DARK = '#1a2147';

export const checkoutStyles = {
    button: {
        bgcolor: THEME_COLOR,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        py: 1.5,
        boxShadow: 'none',
        '&:hover': {
            bgcolor: THEME_COLOR_DARK,
            boxShadow: 'none',
        },
        '&.Mui-disabled': {
            bgcolor: 'rgba(37, 45, 95, 0.5)',
        },
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&.Mui-focused fieldset': {
                borderColor: THEME_COLOR,
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: THEME_COLOR,
        },
    },
    checkbox: {
        color: THEME_COLOR,
        '&.Mui-checked': {
            color: THEME_COLOR,
        },
    },
    paper: {
        elevation: 0,
        borderRadius: 2,
        border: '1px solid #e8e8e8',
    },
};

