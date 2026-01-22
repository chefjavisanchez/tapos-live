export const ALLOWED_ADMINS = [
    'javi@tapygo.com',
    'chefjavisanchez@gmail.com',
    // ADD TEAM EMAILS HERE
];

export const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return ALLOWED_ADMINS.includes(email.toLowerCase().trim());
};
