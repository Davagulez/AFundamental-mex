export const formatYear = (dateString: string) => {
    const year = new Date(dateString);
    return year.getUTCFullYear();
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};