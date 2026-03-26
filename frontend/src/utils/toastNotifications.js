import toast from 'react-hot-toast';

export const toastSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10b981',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
        },
        icon: '✓',
    });
};

export const toastError = (message) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#ef4444',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
        },
        icon: '✕',
    });
};

export const toastLoading = (message) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #0ea5e9',
        },
    });
};

export const toastInfo = (message) => {
    toast(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#0ea5e9',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
        },
        icon: 'ℹ️',
    });
};

export const toastWarning = (message) => {
    toast(message, {
        duration: 3500,
        position: 'top-right',
        style: {
            background: '#f59e0b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
        },
        icon: '⚠️',
    });
};

export const updateToast = (toastId, message, type = 'success') => {
    if (!toastId) return;

    const styles = {
        success: {
            background: '#10b981',
            icon: '✓',
        },
        error: {
            background: '#ef4444',
            icon: '✕',
        },
        info: {
            background: '#0ea5e9',
            icon: 'ℹ️',
        },
    };

    const style = styles[type] || styles.success;

    toast.success(message, {
        id: toastId,
        duration: 3000,
        position: 'top-right',
        style: {
            background: style.background,
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
        },
        icon: style.icon,
    });
};
